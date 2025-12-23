import { IsBoolean, IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFoodDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  porcaoPadrao?: string;

  @IsOptional()
  @IsString()
  porcao_padrao?: string;

  @IsOptional()
  @IsNumber()
  calorias?: number;

  @IsOptional()
  @IsNumber()
  proteinas?: number;

  @IsOptional()
  @IsNumber()
  carboidratos?: number;

  @IsOptional()
  @IsNumber()
  gordurasTotais?: number;

  @IsOptional()
  @IsNumber()
  gorduras_totais?: number;

  @IsOptional()
  @IsNumber()
  gordurasSaturadas?: number;

  @IsOptional()
  @IsNumber()
  gorduras_saturadas?: number;

  @IsOptional()
  @IsNumber()
  gordurasTrans?: number;

  @IsOptional()
  @IsNumber()
  gorduras_trans?: number;

  @IsOptional()
  @IsNumber()
  fibras?: number;

  @IsOptional()
  @IsNumber()
  sodio?: number;

  @IsOptional()
  @IsNumber()
  acucar?: number;

  @IsOptional()
  @IsNumber()
  indiceGlicemico?: number;

  @IsOptional()
  @IsInt()
  indice_glicemico?: number;

  @IsOptional()
  @IsNumber()
  cargaGlicemica?: number;

  @IsOptional()
  @IsNumber()
  carga_glicemica?: number;

  @IsOptional()
  @IsString()
  imagemUrl?: string;

  @IsOptional()
  @IsString()
  imagem_url?: string;

  @IsOptional()
  @IsString()
  fonte?: string;

  @IsOptional()
  @IsInt()
  criadoPor?: number;

  @IsOptional()
  @IsInt()
  criado_por?: number;

  @IsOptional()
  @IsBoolean()
  publico?: boolean;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsDateString()
  dataCriacao?: string;

  @IsOptional()
  @IsDateString()
  data_criacao?: string;
}
