import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() payload: CreatePaymentDto) {
    return this.paymentsService.create(payload);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Post(':id/sync')
  sync(@Param('id') id: string) {
    return this.paymentsService.synchronizeStatus(id);
  }
}
