import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryRepository } from '../../common/persistence/in-memory.repository';
import { AddHealthMetricDto } from './dto/add-health-metric.dto';
import { AddMealLogDto } from './dto/add-meal-log.dto';
import { CreatePatientRecordDto } from './dto/create-patient-record.dto';
import { UpdatePatientRecordDto } from './dto/update-patient-record.dto';
import { HealthMetric, MealLog, PatientRecord } from './entities/patient-record.entity';

@Injectable()
export class PatientsService {
  private readonly repository = new InMemoryRepository<PatientRecord>();

  async create(payload: CreatePatientRecordDto) {
    return this.repository.create({
      userId: payload.userId,
      assignedNutritionistId: payload.assignedNutritionistId,
      healthMetrics: [],
      mealLogs: [],
      reminders: [],
      goals: payload.goals ?? [],
    });
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(`Patient record ${id} not found`);
    }

    return record;
  }

  async findByUserId(userId: string) {
    const record = await this.repository.findOne((item) => item.userId === userId);
    if (!record) {
      throw new NotFoundException(`Patient record for user ${userId} not found`);
    }

    return record;
  }

  async update(id: string, payload: UpdatePatientRecordDto) {
    return this.repository.update(id, payload);
  }

  async addHealthMetric(id: string, payload: AddHealthMetricDto) {
    const record = await this.findById(id);
    const metric: HealthMetric = {
      date: payload.date,
      weightKg: payload.weightKg,
      bodyFatPercent: payload.bodyFatPercent,
      notes: payload.notes,
    };
    record.healthMetrics = [...record.healthMetrics, metric];
    return this.repository.update(id, { healthMetrics: record.healthMetrics });
  }

  async addMealLog(id: string, payload: AddMealLogDto) {
    const record = await this.findById(id);
    const mealLog: MealLog = {
      datetime: payload.datetime,
      items: payload.items,
      calories: payload.calories,
      macros: payload.macros,
    };
    record.mealLogs = [...record.mealLogs, mealLog];
    return this.repository.update(id, { mealLogs: record.mealLogs });
  }
}
