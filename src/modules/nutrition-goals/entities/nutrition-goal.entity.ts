import { Entity } from '../../../common/interfaces/entity.interface';

export interface NutritionGoal extends Entity {
  pacientId: number;
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
}
