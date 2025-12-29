import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../common/database/supabase.module';
import { CreateNutritionGoalDto } from '../nutrition-goals/dto/create-nutrition-goal.dto';
import { NutritionGoalsService } from '../nutrition-goals/nutrition-goals.service';
import { CreateAnamnesisDto } from './dto/create-anamnesis.dto';
import { Anamnesis, AnamnesisAnswer } from './entities/anamnesis.entity';

type AnamnesisRow = {
  id: string;
  usuario_id: string;
  objetivo: string;
  restricoes_alimentares?: string | null;
  preferencias?: string | null;
  motivacao?: string | null;
  respostas: AnamnesisAnswer[] | null;
  criado_em: string | null;
  atualizado_em: string | null;
};

@Injectable()
export class AnamnesisService {
  private readonly tableName = 'anamnese';

  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly nutritionGoalsService: NutritionGoalsService,
  ) {}

  async create(payload: CreateAnamnesisDto) {
    const usuarioId = payload.telefone ?? payload.dadosPessoais?.telefone ?? payload.userId;
    if (!usuarioId) {
      throw new BadRequestException('userId or telefone is required');
    }

    const objective = payload.objective ?? payload.objetivos?.objetivo;
    if (typeof objective !== 'string' || objective.trim().length === 0) {
      throw new BadRequestException('objective is required');
    }

    const answers = payload.answers?.length ? payload.answers : this.buildAnswersFromPayload(payload);
    if (!answers.length) {
      throw new BadRequestException('answers are required');
    }

    const nutritionGoalPayload = this.buildNutritionGoalPayload(payload, usuarioId);

    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        usuario_id: usuarioId,
        objetivo: objective,
        restricoes_alimentares: payload.dietaryRestrictions,
        preferencias: payload.preferences,
        motivacao: payload.motivation,
        respostas: answers,
      })
      .select('*')
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to create anamnesis: ${error.message}`,
      );
    }

    const record = data as AnamnesisRow;

    try {
      await this.nutritionGoalsService.create(nutritionGoalPayload);
    } catch (goalError) {
      await this.safeRollbackAnamnesis(record.id);
      throw goalError;
    }

    return this.mapToAnamnesis(record);
  }

  async findByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('usuario_id', userId)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to load anamnesis for user ${userId}: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`Anamnesis for user ${userId} not found`);
    }

    return this.mapToAnamnesis(data as AnamnesisRow);
  }

  private mapToAnamnesis(record: AnamnesisRow): Anamnesis {
    return {
      id: record.id,
      userId: record.usuario_id,
      objective: record.objetivo,
      dietaryRestrictions: record.restricoes_alimentares ?? undefined,
      preferences: record.preferencias ?? undefined,
      motivation: record.motivacao ?? undefined,
      answers: record.respostas ?? [],
      createdAt: record.criado_em ? new Date(record.criado_em) : new Date(),
      updatedAt: record.atualizado_em ? new Date(record.atualizado_em) : new Date(),
    };
  }

  private buildAnswersFromPayload(payload: CreateAnamnesisDto): AnamnesisAnswer[] {
    const sections: Array<[string, Record<string, unknown> | undefined]> = [
      ['dadosPessoais', payload.dadosPessoais],
      ['historicoSaude', payload.historicoSaude],
      ['objetivos', payload.objetivos],
      ['habitosAlimentares', payload.habitosAlimentares],
      ['estiloVida', payload.estiloVida],
    ];

    const answers: AnamnesisAnswer[] = [];
    for (const [sectionName, section] of sections) {
      if (!section) {
        continue;
      }

      for (const [key, value] of Object.entries(section)) {
        if (value === undefined || value === null) {
          continue;
        }

        const answer = this.formatAnswer(value);
        if (!answer) {
          continue;
        }

        answers.push({
          question: `${sectionName}.${key}`,
          answer,
        });
      }
    }

    return answers;
  }

  private formatAnswer(value: unknown): string {
    if (Array.isArray(value)) {
      return value
        .map((item) => this.formatAnswer(item))
        .filter((item) => item.length > 0)
        .join(', ');
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }

  private buildNutritionGoalPayload(
    payload: CreateAnamnesisDto,
    pacienteRef: string,
  ): CreateNutritionGoalDto {
    const pacientId = this.extractPacientId(pacienteRef);
    const pesoObjetivo = this.extractPesoObjetivo(payload);
    if (pesoObjetivo === undefined) {
      throw new BadRequestException('pesoObjetivo is required to calculate nutrition goals');
    }

    const dataObjetivo = this.extractDataObjetivo(payload);

    return {
      pacientId,
      pesoObjetivo,
      dataObjetivo,
    };
  }

  private extractPacientId(value: string): number {
    const parsed = this.parseStrictNumber(value);
    if (parsed === undefined) {
      throw new BadRequestException('pacient_id must be numeric');
    }

    if (!Number.isInteger(parsed)) {
      throw new BadRequestException('pacient_id must be an integer');
    }

    return parsed;
  }

  private extractPesoObjetivo(payload: CreateAnamnesisDto): number | undefined {
    const weightKeys = [
      'pesoObjetivo',
      'peso_objetivo',
      'pesoMeta',
      'peso_meta',
      'metaPeso',
      'meta_peso',
      'pesoDesejado',
      'peso_desejado',
      'pesoAlvo',
      'peso_alvo',
      'peso',
      'pesoKg',
      'peso_kg',
      'pesoAtual',
      'peso_atual',
    ];

    const sections: Array<Record<string, unknown> | undefined> = [
      payload.objetivos,
      payload.dadosPessoais,
      payload.historicoSaude,
      payload.habitosAlimentares,
      payload.estiloVida,
    ];

    for (const section of sections) {
      const value = this.pickNumberFromSection(section, weightKeys);
      if (value !== undefined) {
        return value;
      }
    }

    return this.pickNumberFromAnswers(payload.answers, weightKeys);
  }

  private extractDataObjetivo(payload: CreateAnamnesisDto): string | undefined {
    const raw = payload.objetivos?.dataObjetivo ?? payload.objetivos?.data_objetivo;
    if (typeof raw !== 'string') {
      return undefined;
    }

    const trimmed = raw.trim();
    if (!/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      return undefined;
    }

    return trimmed.slice(0, 10);
  }

  private pickNumberFromSection(
    section: Record<string, unknown> | undefined,
    keys: string[],
  ): number | undefined {
    if (!section) {
      return undefined;
    }

    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(section, key)) {
        continue;
      }

      const parsed = this.parseNumber(section[key]);
      if (parsed !== undefined) {
        return parsed;
      }
    }

    return undefined;
  }

  private pickNumberFromAnswers(
    answers: AnamnesisAnswer[] | undefined,
    keys: string[],
  ): number | undefined {
    if (!answers?.length) {
      return undefined;
    }

    const normalizedKeys = keys.map((key) => key.toLowerCase());

    for (const answer of answers) {
      const question = answer.question?.toLowerCase() ?? '';
      if (!normalizedKeys.some((key) => question.includes(key))) {
        continue;
      }

      const parsed = this.parseNumber(answer.answer);
      if (parsed !== undefined) {
        return parsed;
      }
    }

    return undefined;
  }

  private parseNumber(value: unknown): number | undefined {
    if (typeof value === 'number') {
      return Number.isNaN(value) || value <= 0 ? undefined : value;
    }

    if (typeof value === 'string') {
      const normalized = value.replace(',', '.');
      const match = normalized.match(/-?\d+(\.\d+)?/);
      if (!match) {
        return undefined;
      }

      const parsed = Number(match[0]);
      if (Number.isNaN(parsed) || parsed <= 0) {
        return undefined;
      }

      return parsed;
    }

    return undefined;
  }

  private parseStrictNumber(value: unknown): number | undefined {
    if (typeof value === 'number') {
      return Number.isNaN(value) || value <= 0 ? undefined : value;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!/^\d+(\.\d+)?$/.test(trimmed)) {
        return undefined;
      }

      const parsed = Number(trimmed);
      if (Number.isNaN(parsed) || parsed <= 0) {
        return undefined;
      }

      return parsed;
    }

    return undefined;
  }

  private async safeRollbackAnamnesis(id: string): Promise<void> {
    await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
  }
}
