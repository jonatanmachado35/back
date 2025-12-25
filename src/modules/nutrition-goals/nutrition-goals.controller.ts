import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateNutritionGoalDto } from './dto/create-nutrition-goal.dto';
import { UpdateNutritionGoalDto } from './dto/update-nutrition-goal.dto';
import { NutritionGoalsService } from './nutrition-goals.service';

const nutritionGoalExample = {
  id: 'goal_123',
  pacientId: 42,
  metaCalorias: 1800,
  metaProteinas: 120,
  metaCarboidratos: 200,
  metaGorduras: 60,
  metaFibras: 30,
  metaAgua: 2.5,
  pesoObjetivo: 72,
  dataObjetivo: '2024-12-31',
  dataInicio: '2024-01-01',
  dataFim: '2024-12-31',
  ativo: true,
  criadoPor: 7,
  createdAt: '2024-01-01T10:00:00.000Z',
  updatedAt: '2024-01-01T10:00:00.000Z',
};

const dailySummaryExample = {
  date: '2024-02-01',
  totals: {
    calorias: 1200,
    proteinas: 80,
    carboidratos: 140,
    gorduras: 40,
    fibras: 20,
    agua: 1.2,
  },
  goals: {
    calorias: 1800,
    proteinas: 120,
    carboidratos: 200,
    gorduras: 60,
    fibras: 30,
    agua: 2.5,
  },
  remaining: {
    calorias: 600,
    proteinas: 40,
    carboidratos: 60,
    gorduras: 20,
    fibras: 10,
    agua: 1.3,
  },
  exceeded: {
    calorias: false,
    proteinas: false,
    carboidratos: false,
    gorduras: false,
    fibras: false,
    agua: false,
  },
};

@ApiTags('Nutrition Goals')
@Controller('metas-nutricionais')
export class NutritionGoalsController {
  constructor(private readonly nutritionGoalsService: NutritionGoalsService) {}

  @Post()
  @ApiCreatedResponse({ schema: { example: nutritionGoalExample } })
  create(@Body() payload: CreateNutritionGoalDto) {
    return this.nutritionGoalsService.create(payload);
  }

  @Patch('paciente/:pacientId')
  @ApiOkResponse({ schema: { example: nutritionGoalExample } })
  updateByPacient(
    @Param('pacientId', ParseIntPipe) pacientId: number,
    @Body() payload: UpdateNutritionGoalDto,
  ) {
    return this.nutritionGoalsService.updateByPacientId(pacientId, payload);
  }

  @Get('paciente/:pacientId/resumo-diario')
  @ApiOkResponse({ schema: { example: dailySummaryExample } })
  getDailySummary(
    @Param('pacientId', ParseIntPipe) pacientId: number,
    @Query('data') date?: string,
  ) {
    return this.nutritionGoalsService.getDailyBalance(pacientId, date);
  }
}
