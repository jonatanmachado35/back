import { Injectable, Logger } from '@nestjs/common';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentGateway } from '../interfaces/payment-gateway.interface';

@Injectable()
export class PagarmeProvider implements PaymentGateway {
  readonly name = 'pagarme';

  async createCharge(payload: CreatePaymentDto) {
    Logger.log(`Simulating charge on Pagar.me for ${payload.userId}`, PagarmeProvider.name);
    return {
      externalReference: `pagarme_${Date.now()}`,
      status: PaymentStatus.PENDING,
    } as const;
  }

  async getPaymentStatus(): Promise<PaymentStatus> {
    return PaymentStatus.PAID;
  }
}
