import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePatientRecordDto {
  @IsOptional()
  @IsString()
  assignedNutritionistId?: string;

  @IsOptional()
  @IsArray()
  goals?: string[];

  @IsOptional()
  @IsArray()
  reminders?: string[];
}
