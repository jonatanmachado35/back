import { Injectable, Logger } from '@nestjs/common';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentGateway } from '../interfaces/payment-gateway.interface';

@Injectable()
export class StripeProvider implements PaymentGateway {
  readonly name = 'stripe';

  async createCharge(payload: CreatePaymentDto) {
    Logger.log(`Simulating charge on Stripe for ${payload.userId}`, StripeProvider.name);
    return {
      externalReference: `stripe_${Date.now()}`,
      status: PaymentStatus.PENDING,
    } as const;
  }

  async getPaymentStatus(): Promise<PaymentStatus> {
    return PaymentStatus.PAID;
  }
}
