import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePatientRecordDto {
  @ApiProperty({ example: 'user_123' })
  @IsString()
  userId!: string;

  @ApiPropertyOptional({ example: 'user_987' })
  @IsOptional()
  @IsString()
  assignedNutritionistId?: string;

  @ApiPropertyOptional({ type: [String], example: ['perder gordura', 'melhorar sono'] })
  @IsOptional()
  @IsArray()
  goals?: string[];
}
