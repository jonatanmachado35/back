import { BillingCycle } from '../../../common/enums/billing-cycle.enum';
import { Entity } from '../../../common/interfaces/entity.interface';

export interface Plan extends Entity {
  name: string;
  description: string;
  audience: 'b2c' | 'professional' | 'admin';
  price: number;
  billingCycle: BillingCycle;
  benefits: string[];
  commissionPercentage?: number;
  discountPercentage?: number;
}
