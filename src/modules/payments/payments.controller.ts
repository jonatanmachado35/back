import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

const paymentExample = {
  id: 'payment_123',
  userId: 'user_123',
  planId: 'plan_456',
  amount: 199.9,
  status: 'pendente',
  provider: 'stripe',
  externalReference: 'ch_123',
  metadata: {
    currency: 'BRL',
  },
  createdAt: '2024-02-01T10:00:00.000Z',
  updatedAt: '2024-02-01T10:00:00.000Z',
};

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiCreatedResponse({ schema: { example: paymentExample } })
  create(@Body() payload: CreatePaymentDto) {
    return this.paymentsService.create(payload);
  }

  @Get()
  @ApiOkResponse({ schema: { example: [paymentExample] } })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Post(':id/sync')
  @ApiOkResponse({ schema: { example: paymentExample } })
  sync(@Param('id') id: string) {
    return this.paymentsService.synchronizeStatus(id);
  }
}
