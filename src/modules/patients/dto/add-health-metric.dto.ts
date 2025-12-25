import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddHealthMetricDto {
  @ApiProperty({ example: '2024-02-01' })
  @IsDateString()
  date!: string;

  @ApiPropertyOptional({ example: 72.4 })
  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @ApiPropertyOptional({ example: 18.5 })
  @IsOptional()
  @IsNumber()
  bodyFatPercent?: number;

  @ApiPropertyOptional({ example: 'avaliacao mensal' })
  @IsOptional()
  @IsString()
  notes?: string;
}
