import { CreatePaymentDto } from '../dto/create-payment.dto';
import { Payment } from '../entities/payment.entity';

export interface PaymentGateway {
  readonly name: string;
  createCharge(payload: CreatePaymentDto): Promise<Pick<Payment, 'externalReference' | 'status'>>;
  getPaymentStatus(externalReference: string): Promise<Payment['status']>;
}
