import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ example: 'user_123' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: '+5511999999999' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ example: { idade: 30, cidade: 'Sao Paulo' } })
  @IsOptional()
  @IsObject()
  dadosPessoais?: DadosPessoaisDto;

  @ApiPropertyOptional({ example: { alergias: 'lactose', condicoes: ['hipertensao'] } })
  @IsOptional()
  @IsObject()
  historicoSaude?: AnamnesisSectionDto;

  @ApiPropertyOptional({ example: { objetivo: 'perder gordura', prazo: '3 meses' } })
  @IsOptional()
  @IsObject()
  objetivos?: ObjetivosDto;

  @ApiPropertyOptional({ example: { refeicoesDia: 4, aguaLitros: 2 } })
  @IsOptional()
  @IsObject()
  habitosAlimentares?: AnamnesisSectionDto;

  @ApiPropertyOptional({ example: { atividadeFisica: '3x por semana', sonoHoras: 7 } })
  @IsOptional()
  @IsObject()
  estiloVida?: AnamnesisSectionDto;

  @ApiPropertyOptional({ example: 'perder gordura' })
  @IsOptional()
  @IsString()
  objective?: string;

  @ApiPropertyOptional({ example: 'lactose' })
  @IsOptional()
  @IsString()
  dietaryRestrictions?: string;

  @ApiPropertyOptional({ example: 'comida caseira' })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiPropertyOptional({ example: 'melhorar saude' })
  @IsOptional()
  @IsString()
  motivation?: string;

  @ApiPropertyOptional({
    example: [
      { question: 'Fuma?', answer: 'Nao' },
      { question: 'Consome alcool?', answer: 'Raramente' },
    ],
  })
  @IsOptional()
  @IsArray()
  answers?: { question: string; answer: string }[];
}
