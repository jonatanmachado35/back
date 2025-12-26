import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AddHealthMetricDto } from './dto/add-health-metric.dto';
import { AddMealLogDto } from './dto/add-meal-log.dto';
import { CreatePatientRecordDto } from './dto/create-patient-record.dto';
import { UpdatePatientRecordDto } from './dto/update-patient-record.dto';
import { PatientsService } from './patients.service';

const patientRecordExample = {
  id: 'record_123',
  userId: 'user_123',
  assignedNutritionistId: 'user_987',
  healthMetrics: [],
  mealLogs: [],
  reminders: [],
  goals: ['perder gordura'],
  createdAt: '2024-02-01T10:00:00.000Z',
  updatedAt: '2024-02-01T10:00:00.000Z',
};

const patientRecordWithMetricExample = {
  ...patientRecordExample,
  healthMetrics: [
    {
      date: '2024-02-01',
      weightKg: 72.4,
      bodyFatPercent: 18.5,
      notes: 'avaliacao mensal',
    },
  ],
  updatedAt: '2024-02-02T10:00:00.000Z',
};

const patientRecordWithMealExample = {
  ...patientRecordExample,
  mealLogs: [
    {
      datetime: '2024-02-01T12:30:00Z',
      items: ['Pao integral', 'Ovo cozido'],
      calories: 450,
      macros: {
        protein: 25,
        carbs: 50,
        fat: 15,
      },
    },
  ],
  updatedAt: '2024-02-02T10:00:00.000Z',
};

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiCreatedResponse({ schema: { example: patientRecordExample } })
  create(@Body() payload: CreatePatientRecordDto) {
    return this.patientsService.create(payload);
  }

  @Get()
  @ApiOkResponse({ schema: { example: [patientRecordExample] } })
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ schema: { example: patientRecordExample } })
  findOne(@Param('id') id: string) {
    return this.patientsService.findById(id);
  }

  @Get('user/:userId')
  @ApiOkResponse({ schema: { example: patientRecordExample } })
  findByUser(@Param('userId') userId: string) {
    return this.patientsService.findByUserId(userId);
  }

  @Get('nutritionist/:nutritionistId')
  @ApiOkResponse({ schema: { example: [patientRecordExample] } })
  findByNutritionist(@Param('nutritionistId') nutritionistId: string) {
    return this.patientsService.findByNutritionistId(nutritionistId);
  }

  @Patch(':id')
  @ApiOkResponse({ schema: { example: patientRecordExample } })
  update(@Param('id') id: string, @Body() payload: UpdatePatientRecordDto) {
    return this.patientsService.update(id, payload);
  }

  @Post(':id/metrics')
  @ApiOkResponse({ schema: { example: patientRecordWithMetricExample } })
  addMetric(@Param('id') id: string, @Body() payload: AddHealthMetricDto) {
    return this.patientsService.addHealthMetric(id, payload);
  }

  @Post(':id/meals')
  @ApiOkResponse({ schema: { example: patientRecordWithMealExample } })
  addMeal(@Param('id') id: string, @Body() payload: AddMealLogDto) {
    return this.patientsService.addMealLog(id, payload);
  }
}
