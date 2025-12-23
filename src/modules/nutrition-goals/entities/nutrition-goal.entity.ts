import { Entity } from '../../../common/interfaces/entity.interface';

export interface NutritionGoal extends Entity {
  pacientId: string;
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
}
