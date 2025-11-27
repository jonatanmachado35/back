import { Entity } from '../../../common/interfaces/entity.interface';

export interface DadosPessoais {
  dataNascimento: string;
  genero: string;
  profissao: string;
  telefone: string;
  cidade: string;
  estado: string;
}

export interface EstiloVida {
  nivelAtividadeFisica: string;
  horasSono: number;
  qualidadeSono: string;
  nivelEstresse: number;
  fuma: boolean;
  consumoAlcool: string;
}

export interface HabitosAlimentares {
  numeroRefeicoes: number;
  aguaPorDia: number;
  restricoesAlimentares: string[];
  alimentosPreferidos: string[];
  alimentosEvitados: string[];
  comeFora: string;
}

export interface HistoricoSaude {
  doencasPreexistentes: string[];
  alergias: string[];
  medicamentos: string[];
  cirurgiasRecentes: string;
  outrasCondicoes: string;
}

export interface Objetivos {
  objetivo: string;
  pesoAtual: number;
  altura: number;
  pesoDesejado: number;
  prazoObjetivo: string;
}

export interface Anamnesis extends Entity {
  userId?: string;
  dadosPessoais: DadosPessoais;
  estiloVida: EstiloVida;
  habitosAlimentares: HabitosAlimentares;
  historicoSaude: HistoricoSaude;
  objetivos: Objetivos;
}
