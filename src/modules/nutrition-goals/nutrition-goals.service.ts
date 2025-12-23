import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../common/database/supabase.module';
import { CreateNutritionGoalDto } from './dto/create-nutrition-goal.dto';
import { UpdateNutritionGoalDto } from './dto/update-nutrition-goal.dto';
import { NutritionGoal } from './entities/nutrition-goal.entity';

type NutritionGoalRow = {
  id: string;
  pacient_id: string;
  meta_calorias?: number | string | null;
  meta_carboidratos?: number | string | null;
  meta_gorduras?: number | string | null;
  meta_fibras?: number | string | null;
  meta_agua?: number | string | null;
  peso_objetivo?: number | string | null;
  data_objetivo?: string | null;
  data_inicio?: string | null;
  data_fim?: string | null;
  ativo?: boolean | null;
  criado_por?: number | string | null;
  criado_em?: string | null;
  atualizado_em?: string | null;
};

type NormalizedNutritionGoal = {
  pacientId?: string;
  metaCalorias?: number;
  metaCarboidratos?: number;
  metaGorduras?: number;
  metaFibras?: number;
  metaAgua?: number;
  pesoObjetivo?: number;
  dataObjetivo?: string;
  dataInicio?: string;
  dataFim?: string;
  ativo?: boolean;
  criadoPor?: number;
};

@Injectable()
export class NutritionGoalsService {
  private readonly tableName = 'metas_nutricionais';

  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async create(payload: CreateNutritionGoalDto): Promise<NutritionGoal> {
    const normalized = this.normalizePayload(payload);
    if (!normalized.pacientId) {
      throw new BadRequestException('pacient_id is required');
    }

    const data = this.buildMutationData(normalized, true);
    const { data: row, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select('*')
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to create nutrition goal: ${error.message}`,
      );
    }

    return this.mapToNutritionGoal(row as NutritionGoalRow);
  }

  async updateByPacientId(
    pacientId: string,
    payload: UpdateNutritionGoalDto,
  ): Promise<NutritionGoal> {
    const normalized = this.normalizePayload(payload);
    const data = this.buildMutationData(normalized, false);

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    const { data: row, error } = await this.supabase
      .from(this.tableName)
      .update(data)
      .eq('pacient_id', pacientId)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to update nutrition goal for pacient ${pacientId}: ${error.message}`,
      );
    }

    if (!row) {
      throw new NotFoundException(`Nutrition goal for pacient ${pacientId} not found`);
    }

    return this.mapToNutritionGoal(row as NutritionGoalRow);
  }

  private normalizePayload(
    payload: CreateNutritionGoalDto | UpdateNutritionGoalDto,
  ): NormalizedNutritionGoal {
    return {
      pacientId: payload.pacientId ?? payload.pacient_id,
      metaCalorias: payload.metaCalorias ?? payload.meta_calorias,
      metaCarboidratos: payload.metaCarboidratos ?? payload.meta_carboidratos,
      metaGorduras: payload.metaGorduras ?? payload.meta_gorduras,
      metaFibras: payload.metaFibras ?? payload.meta_fibras,
      metaAgua: payload.metaAgua ?? payload.meta_agua,
      pesoObjetivo: payload.pesoObjetivo ?? payload.peso_objetivo,
      dataObjetivo: payload.dataObjetivo ?? payload.data_objetivo,
      dataInicio: payload.dataInicio ?? payload.data_inicio,
      dataFim: payload.dataFim ?? payload.data_fim,
      ativo: payload.ativo,
      criadoPor: payload.criadoPor ?? payload.criado_por,
    };
  }

  private buildMutationData(
    payload: NormalizedNutritionGoal,
    includePacientId: boolean,
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    if (includePacientId && payload.pacientId !== undefined) {
      data.pacient_id = payload.pacientId;
    }

    if (payload.metaCalorias !== undefined) {
      data.meta_calorias = payload.metaCalorias;
    }

    if (payload.metaCarboidratos !== undefined) {
      data.meta_carboidratos = payload.metaCarboidratos;
    }

    if (payload.metaGorduras !== undefined) {
      data.meta_gorduras = payload.metaGorduras;
    }

    if (payload.metaFibras !== undefined) {
      data.meta_fibras = payload.metaFibras;
    }

    if (payload.metaAgua !== undefined) {
      data.meta_agua = payload.metaAgua;
    }

    if (payload.pesoObjetivo !== undefined) {
      data.peso_objetivo = payload.pesoObjetivo;
    }

    if (payload.dataObjetivo !== undefined) {
      data.data_objetivo = payload.dataObjetivo;
    }

    if (payload.dataInicio !== undefined) {
      data.data_inicio = payload.dataInicio;
    }

    if (payload.dataFim !== undefined) {
      data.data_fim = payload.dataFim;
    }

    if (payload.ativo !== undefined) {
      data.ativo = payload.ativo;
    }

    if (payload.criadoPor !== undefined) {
      data.criado_por = payload.criadoPor;
    }

    return data;
  }

  private mapToNutritionGoal(record: NutritionGoalRow): NutritionGoal {
    return {
      id: record.id,
      pacientId: record.pacient_id,
      metaCalorias: this.toNumber(record.meta_calorias),
      metaCarboidratos: this.toNumber(record.meta_carboidratos),
      metaGorduras: this.toNumber(record.meta_gorduras),
      metaFibras: this.toNumber(record.meta_fibras),
      metaAgua: this.toNumber(record.meta_agua),
      pesoObjetivo: this.toNumber(record.peso_objetivo),
      dataObjetivo: record.data_objetivo ?? undefined,
      dataInicio: record.data_inicio ?? undefined,
      dataFim: record.data_fim ?? undefined,
      ativo: record.ativo ?? undefined,
      criadoPor: this.toNumber(record.criado_por),
      createdAt: record.criado_em ? new Date(record.criado_em) : new Date(),
      updatedAt: record.atualizado_em ? new Date(record.atualizado_em) : new Date(),
    };
  }

  private toNumber(value: number | string | null | undefined): number | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    const parsed = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(parsed)) {
      return undefined;
    }

    return parsed;
  }
}
