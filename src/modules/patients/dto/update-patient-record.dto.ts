import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePatientRecordDto {
  @ApiPropertyOptional({ example: 'user_987' })
  @IsOptional()
  @IsString()
  assignedNutritionistId?: string;

  @ApiPropertyOptional({ type: [String], example: ['perder gordura', 'melhorar sono'] })
  @IsOptional()
  @IsArray()
  goals?: string[];

  @ApiPropertyOptional({ type: [String], example: ['beber agua', 'registrar refeicoes'] })
  @IsOptional()
  @IsArray()
  reminders?: string[];
}
