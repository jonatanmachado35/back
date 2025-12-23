import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
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
    @Param('pacientId') pacientId: string,
    @Body() payload: UpdateNutritionGoalDto,
  ) {
    return this.nutritionGoalsService.updateByPacientId(pacientId, payload);
  }
}
