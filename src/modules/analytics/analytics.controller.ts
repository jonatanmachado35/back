import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

const dashboardExample = {
  activePatients: 12,
  totalRevenue: 1990.5,
  averageWeight: 72.4,
  planUsage: [
    {
      planId: 'plan_1',
      name: 'ZapNutre Pessoal Mensal',
      audience: 'b2c',
      price: 49.9,
      subscriptions: 5,
    },
  ],
};

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOkResponse({ schema: { example: dashboardExample } })
  getDashboard() {
    return this.analyticsService.getDashboard();
  }
}
