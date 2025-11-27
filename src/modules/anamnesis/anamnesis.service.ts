import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../common/database/supabase.module';
import { CreateAnamnesisDto } from './dto/create-anamnesis.dto';
import { Anamnesis } from './entities/anamnesis.entity';

type AnamnesisRow = {
  id: string;
  usuario_id: string | null;
  dados: {
    dadosPessoais: unknown;
    estiloVida: unknown;
    habitosAlimentares: unknown;
    historicoSaude: unknown;
    objetivos: unknown;
  };
  criado_em: string;
  atualizado_em: string;
};

@Injectable()
export class AnamnesisService {
  private readonly tableName = 'anamnese';

  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) { }

  async create(payload: CreateAnamnesisDto): Promise<Anamnesis> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        usuario_id: payload.userId ?? null,
        dados: {
          dadosPessoais: payload.dadosPessoais,
          estiloVida: payload.estiloVida,
          habitosAlimentares: payload.habitosAlimentares,
          historicoSaude: payload.historicoSaude,
          objetivos: payload.objetivos,
        },
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

  async findByUserId(userId: string): Promise<Anamnesis> {
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

  private mapToAnamnesis(row: AnamnesisRow): Anamnesis {
    return {
      id: row.id,
      userId: row.usuario_id ?? undefined,
      dadosPessoais: row.dados.dadosPessoais as Anamnesis['dadosPessoais'],
      estiloVida: row.dados.estiloVida as Anamnesis['estiloVida'],
      habitosAlimentares: row.dados.habitosAlimentares as Anamnesis['habitosAlimentares'],
      historicoSaude: row.dados.historicoSaude as Anamnesis['historicoSaude'],
      objetivos: row.dados.objetivos as Anamnesis['objetivos'],
      createdAt: new Date(row.criado_em),
      updatedAt: new Date(row.atualizado_em),
    };
  }
}
