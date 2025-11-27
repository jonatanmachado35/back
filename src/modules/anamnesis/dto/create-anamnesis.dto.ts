import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateAnamnesisDto {

  @IsString()
  objective!: string;

  @IsOptional()
  @IsString()
  dietaryRestrictions?: string;

  @IsOptional()
  @IsString()
  preferences?: string;

  @IsOptional()
  @IsString()
  motivation?: string;

  @IsArray()
  answers!: { question: string; answer: string }[];
}
