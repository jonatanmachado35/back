import { Entity } from '../../../common/interfaces/entity.interface';

export interface Food extends Entity<number> {
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
}
