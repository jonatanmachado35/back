import { Module } from '@nestjs/common';
import { NutritionGoalsModule } from '../nutrition-goals/nutrition-goals.module';
import { AnamnesisController } from './anamnesis.controller';
import { AnamnesisService } from './anamnesis.service';

@Module({
  imports: [NutritionGoalsModule],
  controllers: [AnamnesisController],
  providers: [AnamnesisService],
  exports: [AnamnesisService],
})
export class AnamnesisModule {}
