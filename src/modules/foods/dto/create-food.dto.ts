import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFoodDto {
  @ApiPropertyOptional({ example: 123 })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiPropertyOptional({ example: 'Pao integral' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: 'Padaria Central' })
  @IsOptional()
  @IsString()
  marca?: string;

  @ApiPropertyOptional({ example: 'Panificados' })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiPropertyOptional({ example: '50 g' })
  @IsOptional()
  @IsString()
  porcaoPadrao?: string;

  @ApiPropertyOptional({ example: '50 g' })
  @IsOptional()
  @IsString()
  porcao_padrao?: string;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsNumber()
  calorias?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  proteinas?: number;

  @ApiPropertyOptional({ example: 22 })
  @IsOptional()
  @IsNumber()
  carboidratos?: number;

  @ApiPropertyOptional({ example: 2.5 })
  @IsOptional()
  @IsNumber()
  gordurasTotais?: number;

  @ApiPropertyOptional({ example: 2.5 })
  @IsOptional()
  @IsNumber()
  gorduras_totais?: number;

  @ApiPropertyOptional({ example: 0.5 })
  @IsOptional()
  @IsNumber()
  gordurasSaturadas?: number;

  @ApiPropertyOptional({ example: 0.5 })
  @IsOptional()
  @IsNumber()
  gorduras_saturadas?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  gordurasTrans?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  gorduras_trans?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  fibras?: number;

  @ApiPropertyOptional({ example: 180 })
  @IsOptional()
  @IsNumber()
  sodio?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  acucar?: number;

  @ApiPropertyOptional({ example: 55 })
  @IsOptional()
  @IsNumber()
  indiceGlicemico?: number;

  @ApiPropertyOptional({ example: 55 })
  @IsOptional()
  @IsInt()
  indice_glicemico?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  cargaGlicemica?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  carga_glicemica?: number;

  @ApiPropertyOptional({ example: 'https://cdn.exemplo.com/foods/123.png' })
  @IsOptional()
  @IsString()
  imagemUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.exemplo.com/foods/123.png' })
  @IsOptional()
  @IsString()
  imagem_url?: string;

  @ApiPropertyOptional({ example: 'tabela_taco' })
  @IsOptional()
  @IsString()
  fonte?: string;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsInt()
  criadoPor?: number;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsInt()
  criado_por?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  publico?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional({ example: '2024-01-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  dataCriacao?: string;

  @ApiPropertyOptional({ example: '2024-01-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  data_criacao?: string;
}
