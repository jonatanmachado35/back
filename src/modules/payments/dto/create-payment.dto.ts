import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';

export class CreatePaymentDto {
  @ApiProperty({ example: 'user_123' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: 'plan_456' })
  @IsString()
  planId!: string;

  @ApiProperty({ example: 199.9 })
  @IsNumber()
  amount!: number;

  @ApiProperty({ example: 'stripe' })
  @IsString()
  provider!: string;

  @ApiPropertyOptional({ enum: PaymentStatus, example: PaymentStatus.PENDING })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ example: { chargeId: 'ch_123', currency: 'BRL' } })
  @IsOptional()
  metadata?: Record<string, unknown>;
}
