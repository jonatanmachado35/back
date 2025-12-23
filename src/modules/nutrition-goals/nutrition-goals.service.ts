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
  pacient_id: number;
  meta_calorias?: number | string | null;
  meta_proteinas?: number | string | null;
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
  pacientId?: number;
  metaCalorias?: number;
  metaProteinas?: number;
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
  // Default calculation factors; adjust to match your nutrition rules.
  private readonly caloriesPerKg = 30;
  private readonly proteinPerKg = 2.0;
  private readonly fatPerKg = 0.8;
  private readonly fiberPerKcal = 14 / 1000;
  private readonly waterLitersPerKg = 0.035;

  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async create(payload: CreateNutritionGoalDto): Promise<NutritionGoal> {
    const normalized = this.normalizePayload(payload);
    if (normalized.pacientId === undefined) {
      throw new BadRequestException('pacient_id is required');
    }
    if (!Number.isInteger(normalized.pacientId)) {
      throw new BadRequestException('pacient_id must be an integer');
    }

    const calculated = this.applyCalculatedFields(normalized);
    const data = this.buildMutationData(calculated, true);
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
    pacientId: number,
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
    const rawPacientId = payload.pacientId ?? payload.pacient_id;
    const pacientId = rawPacientId !== undefined ? this.toNumber(rawPacientId) : undefined;
    return {
      pacientId,
      metaCalorias: payload.metaCalorias ?? payload.meta_calorias,
      metaProteinas: payload.metaProteinas ?? payload.meta_proteinas,
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

    if (payload.metaProteinas !== undefined) {
      data.meta_proteinas = payload.metaProteinas;
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
      metaProteinas: this.toNumber(record.meta_proteinas),
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

  private applyCalculatedFields(payload: NormalizedNutritionGoal): NormalizedNutritionGoal {
    const result: NormalizedNutritionGoal = { ...payload };
    const needsCalc = [
      result.metaCalorias,
      result.metaProteinas,
      result.metaCarboidratos,
      result.metaGorduras,
      result.metaFibras,
      result.metaAgua,
    ].some((value) => value === undefined);

    if (!needsCalc) {
      return result;
    }

    if (result.pesoObjetivo === undefined) {
      throw new BadRequestException('peso_objetivo is required to calculate nutrition goals');
    }

    const peso = result.pesoObjetivo;
    if (Number.isNaN(peso)) {
      throw new BadRequestException('peso_objetivo must be a number');
    }
    if (result.metaCalorias === undefined) {
      result.metaCalorias = this.round(peso * this.caloriesPerKg);
    }

    if (result.metaProteinas === undefined) {
      result.metaProteinas = this.round(peso * this.proteinPerKg);
    }

    if (result.metaGorduras === undefined) {
      result.metaGorduras = this.round(peso * this.fatPerKg);
    }

    if (result.metaFibras === undefined && result.metaCalorias !== undefined) {
      result.metaFibras = this.round(result.metaCalorias * this.fiberPerKcal);
    }

    if (result.metaAgua === undefined) {
      result.metaAgua = this.round(peso * this.waterLitersPerKg, 3);
    }

    if (result.metaCarboidratos === undefined && result.metaCalorias !== undefined) {
      const proteinCalories = (result.metaProteinas ?? 0) * 4;
      const fatCalories = (result.metaGorduras ?? 0) * 9;
      const remainingCalories = result.metaCalorias - proteinCalories - fatCalories;
      const carbs = remainingCalories > 0 ? remainingCalories / 4 : 0;
      result.metaCarboidratos = this.round(carbs);
    }

    return result;
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

  private round(value: number, precision = 2): number {
    const factor = 10 ** precision;
    return Math.round(value * factor) / factor;
  }
}
