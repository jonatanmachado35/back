import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AddHealthMetricDto } from './dto/add-health-metric.dto';
import { AddMealLogDto } from './dto/add-meal-log.dto';
import { CreatePatientRecordDto } from './dto/create-patient-record.dto';
import { UpdatePatientRecordDto } from './dto/update-patient-record.dto';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() payload: CreatePatientRecordDto) {
    return this.patientsService.create(payload);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findById(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.patientsService.findByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdatePatientRecordDto) {
    return this.patientsService.update(id, payload);
  }

  @Post(':id/metrics')
  addMetric(@Param('id') id: string, @Body() payload: AddHealthMetricDto) {
    return this.patientsService.addHealthMetric(id, payload);
  }

  @Post(':id/meals')
  addMeal(@Param('id') id: string, @Body() payload: AddMealLogDto) {
    return this.patientsService.addMealLog(id, payload);
  }
}
