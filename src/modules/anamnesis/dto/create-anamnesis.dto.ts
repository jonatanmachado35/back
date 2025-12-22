import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export type DadosPessoaisDto = {
  telefone?: string;
  [key: string]: unknown;
};

export type ObjetivosDto = {
  objetivo?: string;
  [key: string]: unknown;
};

export type AnamnesisSectionDto = Record<string, unknown>;

export class CreateAnamnesisDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsObject()
  dadosPessoais?: DadosPessoaisDto;

  @IsOptional()
  @IsObject()
  historicoSaude?: AnamnesisSectionDto;

  @IsOptional()
  @IsObject()
  objetivos?: ObjetivosDto;

  @IsOptional()
  @IsObject()
  habitosAlimentares?: AnamnesisSectionDto;

  @IsOptional()
  @IsObject()
  estiloVida?: AnamnesisSectionDto;

  @IsOptional()
  @IsString()
  objective?: string;

  @IsOptional()
  @IsString()
  dietaryRestrictions?: string;

  @IsOptional()
  @IsString()
  preferences?: string;

  @IsOptional()
  @IsString()
  motivation?: string;

  @IsOptional()
  @IsArray()
  answers?: { question: string; answer: string }[];
}
