import { Entity } from '../../../common/interfaces/entity.interface';

export interface HealthMetric {
  date: string;
  weightKg?: number;
  bodyFatPercent?: number;
  notes?: string;
}

export interface MealLog {
  datetime: string;
  items: string[];
  calories?: number;
  macros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface PatientRecord extends Entity {
  userId: string;
  assignedNutritionistId?: string;
  healthMetrics: HealthMetric[];
  mealLogs: MealLog[];
  reminders: string[];
  goals: string[];
}
