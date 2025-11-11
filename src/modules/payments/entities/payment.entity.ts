import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { Entity } from '../../../common/interfaces/entity.interface';

export interface Payment extends Entity {
  userId: string;
  planId: string;
  amount: number;
  status: PaymentStatus;
  provider: string;
  externalReference?: string;
  metadata?: Record<string, unknown>;
}
