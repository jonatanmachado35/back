import { Module } from '@nestjs/common';
import { NutritionGoalsController } from './nutrition-goals.controller';
import { NutritionGoalsService } from './nutrition-goals.service';

@Module({
  controllers: [NutritionGoalsController],
  providers: [NutritionGoalsService],
  exports: [NutritionGoalsService],
})
export class NutritionGoalsModule {}
