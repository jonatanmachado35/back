import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PlansService } from './plans.service';

const planExample = {
  id: 'plan_1',
  name: 'ZapNutre Pessoal Mensal',
  description: 'Plano individual para acompanhamento mensal',
  audience: 'b2c',
  price: 49.9,
  billingCycle: 'mensal',
  benefits: [
    'Dashboard com evolucao de peso e medidas',
    'Plano alimentar personalizado',
    'Acesso ao ZapNutre via WhatsApp',
  ],
  discountPercentage: 0,
  createdAt: '2024-02-01T10:00:00.000Z',
  updatedAt: '2024-02-01T10:00:00.000Z',
};

@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOkResponse({ schema: { example: [planExample] } })
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ schema: { example: planExample } })
  findOne(@Param('id') id: string) {
    return this.plansService.findById(id);
  }
}
