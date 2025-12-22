import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../common/database/supabase.module';
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

  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

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

    return this.mapToAnamnesis(data as AnamnesisRow);
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
}
