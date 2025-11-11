import { Entity } from '../../../common/interfaces/entity.interface';

export interface AnamnesisAnswer {
  question: string;
  answer: string;
}

export interface Anamnesis extends Entity {
  userId: string;
  objective: string;
  dietaryRestrictions?: string;
  preferences?: string;
  motivation?: string;
  answers: AnamnesisAnswer[];
}
