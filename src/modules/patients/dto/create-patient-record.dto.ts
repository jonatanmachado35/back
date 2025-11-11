import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePatientRecordDto {
  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  assignedNutritionistId?: string;

  @IsOptional()
  @IsArray()
  goals?: string[];
}
