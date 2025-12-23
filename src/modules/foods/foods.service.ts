import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../common/database/supabase.module';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food } from './entities/food.entity';

type FoodRow = {
  id: number;
  nome?: string | null;
  marca?: string | null;
  categoria?: string | null;
  porcao_padrao?: string | null;
  calorias?: number | string | null;
  proteinas?: number | string | null;
  carboidratos?: number | string | null;
  gorduras_totais?: number | string | null;
  gorduras_saturadas?: number | string | null;
  gorduras_trans?: number | string | null;
  fibras?: number | string | null;
  sodio?: number | string | null;
  acucar?: number | string | null;
  indice_glicemico?: number | string | null;
  carga_glicemica?: number | string | null;
  imagem_url?: string | null;
  fonte?: string | null;
  criado_por?: number | string | null;
  publico?: boolean | null;
  ativo?: boolean | null;
  data_criacao?: string | null;
};

type NormalizedFood = {
  id?: number;
  nome?: string;
  marca?: string;
  categoria?: string;
  porcaoPadrao?: string;
  calorias?: number;
  proteinas?: number;
  carboidratos?: number;
  gordurasTotais?: number;
  gordurasSaturadas?: number;
  gordurasTrans?: number;
  fibras?: number;
  sodio?: number;
  acucar?: number;
  indiceGlicemico?: number;
  cargaGlicemica?: number;
  imagemUrl?: string;
  fonte?: string;
  criadoPor?: number;
  publico?: boolean;
  ativo?: boolean;
  dataCriacao?: string;
};

@Injectable()
export class FoodsService {
  private readonly tableName = 'alimentos';

  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async create(payload: CreateFoodDto): Promise<Food> {
    const normalized = this.normalizePayload(payload);
    if (!normalized.nome) {
      throw new BadRequestException('nome is required');
    }

    const data = this.buildMutationData(normalized);
    const { data: row, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select('*')
      .single();

    if (error) {
      throw new InternalServerErrorException(`Failed to create food: ${error.message}`);
    }

    return this.mapToFood(row as FoodRow);
  }

  async findAll(): Promise<Food[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(`Failed to load foods: ${error.message}`);
    }

    return (data as FoodRow[]).map((row) => this.mapToFood(row));
  }

  async findById(id: number): Promise<Food> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(`Failed to load food ${id}: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException(`Food ${id} not found`);
    }

    return this.mapToFood(data as FoodRow);
  }

  async update(id: number, payload: UpdateFoodDto): Promise<Food> {
    const normalized = this.normalizePayload(payload);
    const data = this.buildMutationData(normalized);

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    const { data: row, error } = await this.supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(`Failed to update food ${id}: ${error.message}`);
    }

    if (!row) {
      throw new NotFoundException(`Food ${id} not found`);
    }

    return this.mapToFood(row as FoodRow);
  }

  private normalizePayload(payload: CreateFoodDto | UpdateFoodDto): NormalizedFood {
    return {
      id: payload.id,
      nome: payload.nome,
      marca: payload.marca,
      categoria: payload.categoria,
      porcaoPadrao: payload.porcaoPadrao ?? payload.porcao_padrao,
      calorias: payload.calorias,
      proteinas: payload.proteinas,
      carboidratos: payload.carboidratos,
      gordurasTotais: payload.gordurasTotais ?? payload.gorduras_totais,
      gordurasSaturadas: payload.gordurasSaturadas ?? payload.gorduras_saturadas,
      gordurasTrans: payload.gordurasTrans ?? payload.gorduras_trans,
      fibras: payload.fibras,
      sodio: payload.sodio,
      acucar: payload.acucar,
      indiceGlicemico: payload.indiceGlicemico ?? payload.indice_glicemico,
      cargaGlicemica: payload.cargaGlicemica ?? payload.carga_glicemica,
      imagemUrl: payload.imagemUrl ?? payload.imagem_url,
      fonte: payload.fonte,
      criadoPor: payload.criadoPor ?? payload.criado_por,
      publico: payload.publico,
      ativo: payload.ativo,
      dataCriacao: payload.dataCriacao ?? payload.data_criacao,
    };
  }

  private buildMutationData(payload: NormalizedFood): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    if (payload.id !== undefined) {
      data.id = payload.id;
    }

    if (payload.nome !== undefined) {
      data.nome = payload.nome;
    }

    if (payload.marca !== undefined) {
      data.marca = payload.marca;
    }

    if (payload.categoria !== undefined) {
      data.categoria = payload.categoria;
    }

    if (payload.porcaoPadrao !== undefined) {
      data.porcao_padrao = payload.porcaoPadrao;
    }

    if (payload.calorias !== undefined) {
      data.calorias = payload.calorias;
    }

    if (payload.proteinas !== undefined) {
      data.proteinas = payload.proteinas;
    }

    if (payload.carboidratos !== undefined) {
      data.carboidratos = payload.carboidratos;
    }

    if (payload.gordurasTotais !== undefined) {
      data.gorduras_totais = payload.gordurasTotais;
    }

    if (payload.gordurasSaturadas !== undefined) {
      data.gorduras_saturadas = payload.gordurasSaturadas;
    }

    if (payload.gordurasTrans !== undefined) {
      data.gorduras_trans = payload.gordurasTrans;
    }

    if (payload.fibras !== undefined) {
      data.fibras = payload.fibras;
    }

    if (payload.sodio !== undefined) {
      data.sodio = payload.sodio;
    }

    if (payload.acucar !== undefined) {
      data.acucar = payload.acucar;
    }

    if (payload.indiceGlicemico !== undefined) {
      data.indice_glicemico = payload.indiceGlicemico;
    }

    if (payload.cargaGlicemica !== undefined) {
      data.carga_glicemica = payload.cargaGlicemica;
    }

    if (payload.imagemUrl !== undefined) {
      data.imagem_url = payload.imagemUrl;
    }

    if (payload.fonte !== undefined) {
      data.fonte = payload.fonte;
    }

    if (payload.criadoPor !== undefined) {
      data.criado_por = payload.criadoPor;
    }

    if (payload.publico !== undefined) {
      data.publico = payload.publico;
    }

    if (payload.ativo !== undefined) {
      data.ativo = payload.ativo;
    }

    if (payload.dataCriacao !== undefined) {
      data.data_criacao = payload.dataCriacao;
    }

    return data;
  }

  private mapToFood(record: FoodRow): Food {
    const createdAt = record.data_criacao ? new Date(record.data_criacao) : new Date();
    return {
      id: record.id,
      nome: record.nome ?? undefined,
      marca: record.marca ?? undefined,
      categoria: record.categoria ?? undefined,
      porcaoPadrao: record.porcao_padrao ?? undefined,
      calorias: this.toNumber(record.calorias),
      proteinas: this.toNumber(record.proteinas),
      carboidratos: this.toNumber(record.carboidratos),
      gordurasTotais: this.toNumber(record.gorduras_totais),
      gordurasSaturadas: this.toNumber(record.gorduras_saturadas),
      gordurasTrans: this.toNumber(record.gorduras_trans),
      fibras: this.toNumber(record.fibras),
      sodio: this.toNumber(record.sodio),
      acucar: this.toNumber(record.acucar),
      indiceGlicemico: this.toNumber(record.indice_glicemico),
      cargaGlicemica: this.toNumber(record.carga_glicemica),
      imagemUrl: record.imagem_url ?? undefined,
      fonte: record.fonte ?? undefined,
      criadoPor: this.toNumber(record.criado_por),
      publico: record.publico ?? undefined,
      ativo: record.ativo ?? undefined,
      dataCriacao: record.data_criacao ?? undefined,
      createdAt,
      updatedAt: createdAt,
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
