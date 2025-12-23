import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateNutritionGoalDto } from './dto/create-nutrition-goal.dto';
import { UpdateNutritionGoalDto } from './dto/update-nutrition-goal.dto';
import { NutritionGoalsService } from './nutrition-goals.service';

@Controller('metas-nutricionais')
export class NutritionGoalsController {
  constructor(private readonly nutritionGoalsService: NutritionGoalsService) {}

  @Post()
  create(@Body() payload: CreateNutritionGoalDto) {
    return this.nutritionGoalsService.create(payload);
  }

  @Patch('paciente/:pacientId')
  updateByPacient(
    @Param('pacientId', ParseIntPipe) pacientId: number,
    @Body() payload: UpdateNutritionGoalDto,
  ) {
    return this.nutritionGoalsService.updateByPacientId(pacientId, payload);
  }

  @Get('paciente/:pacientId/resumo-diario')
  getDailySummary(
    @Param('pacientId', ParseIntPipe) pacientId: number,
    @Query('data') date?: string,
  ) {
    return this.nutritionGoalsService.getDailyBalance(pacientId, date);
  }
}
