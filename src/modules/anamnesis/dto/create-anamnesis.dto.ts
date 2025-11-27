import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

class DadosPessoaisDto {
  @IsString()
  dataNascimento!: string;

  @IsString()
  genero!: string;

  @IsString()
  profissao!: string;

  @IsString()
  telefone!: string;

  @IsString()
  cidade!: string;

  @IsString()
  estado!: string;
}

class EstiloVidaDto {
  @IsString()
  nivelAtividadeFisica!: string;

  @IsNumber()
  horasSono!: number;

  @IsString()
  qualidadeSono!: string;

  @IsNumber()
  nivelEstresse!: number;

  @IsBoolean()
  fuma!: boolean;

  @IsString()
  consumoAlcool!: string;
}

class HabitosAlimentaresDto {
  @IsNumber()
  numeroRefeicoes!: number;

  @IsNumber()
  aguaPorDia!: number;

  @IsArray()
  @IsString({ each: true })
  restricoesAlimentares!: string[];

  @IsArray()
  @IsString({ each: true })
  alimentosPreferidos!: string[];

  @IsArray()
  @IsString({ each: true })
  alimentosEvitados!: string[];

  @IsString()
  comeFora!: string;
}

class HistoricoSaudeDto {
  @IsArray()
  @IsString({ each: true })
  doencasPreexistentes!: string[];

  @IsArray()
  @IsString({ each: true })
  alergias!: string[];

  @IsArray()
  @IsString({ each: true })
  medicamentos!: string[];

  @IsString()
  cirurgiasRecentes!: string;

  @IsString()
  outrasCondicoes!: string;
}

class ObjetivosDto {
  @IsString()
  objetivo!: string;

  @IsNumber()
  pesoAtual!: number;

  @IsNumber()
  altura!: number;

  @IsNumber()
  pesoDesejado!: number;

  @IsString()
  prazoObjetivo!: string;
}

export class CreateAnamnesisDto {
  @IsObject()
  @ValidateNested()
  @Type(() => DadosPessoaisDto)
  dadosPessoais!: DadosPessoaisDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EstiloVidaDto)
  estiloVida!: EstiloVidaDto;

  @IsObject()
  @ValidateNested()
  @Type(() => HabitosAlimentaresDto)
  habitosAlimentares!: HabitosAlimentaresDto;

  @IsObject()
  @ValidateNested()
  @Type(() => HistoricoSaudeDto)
  historicoSaude!: HistoricoSaudeDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ObjetivosDto)
  objetivos!: ObjetivosDto;
}
