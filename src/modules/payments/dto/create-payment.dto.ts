import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';

export class CreatePaymentDto {
  @IsString()
  userId!: string;

  @IsString()
  planId!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  provider!: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  metadata?: Record<string, unknown>;
}
