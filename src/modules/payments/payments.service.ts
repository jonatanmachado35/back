import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { InMemoryRepository } from '../../common/persistence/in-memory.repository';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentGateway } from './interfaces/payment-gateway.interface';

@Injectable()
export class PaymentsService {
  private readonly repository = new InMemoryRepository<Payment>();

  constructor(
    @Inject('PAYMENT_GATEWAYS') private readonly gateways: PaymentGateway[],
  ) {}

  private resolveGateway(name: string): PaymentGateway {
    const gateway = this.gateways.find((provider) => provider.name === name);
    if (!gateway) {
      throw new NotFoundException(`Payment gateway ${name} not configured`);
    }
    return gateway;
  }

  async create(payload: CreatePaymentDto) {
    const gateway = this.resolveGateway(payload.provider);
    const result = await gateway.createCharge(payload);

    return this.repository.create({
      userId: payload.userId,
      planId: payload.planId,
      amount: payload.amount,
      provider: gateway.name,
      status: result.status ?? payload.status ?? PaymentStatus.PENDING,
      externalReference: result.externalReference,
      metadata: payload.metadata,
    });
  }

  async synchronizeStatus(id: string) {
    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }

    if (!payment.externalReference) {
      return payment;
    }

    const gateway = this.resolveGateway(payment.provider);
    const status = await gateway.getPaymentStatus(payment.externalReference);

    if (status !== payment.status) {
      return this.repository.update(id, { status });
    }

    return payment;
  }

  findAll() {
    return this.repository.findAll();
  }
}
