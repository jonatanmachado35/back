import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateNutritionGoalDto {
  @IsOptional()
  @IsNumber()
  pacientId?: number;

  @IsOptional()
  @IsNumber()
  pacient_id?: number;

  @IsOptional()
  @IsNumber()
  metaCalorias?: number;

  @IsOptional()
  @IsNumber()
  meta_calorias?: number;

  @IsOptional()
  @IsNumber()
  metaProteinas?: number;

  @IsOptional()
  @IsNumber()
  meta_proteinas?: number;

  @IsOptional()
  @IsNumber()
  metaCarboidratos?: number;

  @IsOptional()
  @IsNumber()
  meta_carboidratos?: number;

  @IsOptional()
  @IsNumber()
  metaGorduras?: number;

  @IsOptional()
  @IsNumber()
  meta_gorduras?: number;

  @IsOptional()
  @IsNumber()
  metaFibras?: number;

  @IsOptional()
  @IsNumber()
  meta_fibras?: number;

  @IsOptional()
  @IsNumber()
  metaAgua?: number;

  @IsOptional()
  @IsNumber()
  meta_agua?: number;

  @IsOptional()
  @IsNumber()
  pesoObjetivo?: number;

  @IsOptional()
  @IsNumber()
  peso_objetivo?: number;

  @IsOptional()
  @IsDateString()
  dataObjetivo?: string;

  @IsOptional()
  @IsDateString()
  data_objetivo?: string;

  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  data_inicio?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @IsOptional()
  @IsDateString()
  data_fim?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsNumber()
  criadoPor?: number;

  @IsOptional()
  @IsNumber()
  criado_por?: number;
}
