import { IsArray, IsDateString, IsNumber, IsObject, IsOptional } from 'class-validator';

export class AddMealLogDto {
  @IsDateString()
  datetime!: string;

  @IsArray()
  items!: string[];

  @IsOptional()
  @IsNumber()
  calories?: number;

  @IsOptional()
  @IsObject()
  macros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}
