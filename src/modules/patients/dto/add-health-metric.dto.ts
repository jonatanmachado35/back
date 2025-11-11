import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddHealthMetricDto {
  @IsDateString()
  date!: string;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  bodyFatPercent?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
