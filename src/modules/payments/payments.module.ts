import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PagarmeProvider } from './providers/pagarme.provider';
import { StripeProvider } from './providers/stripe.provider';

@Module({
  controllers: [PaymentsController],
  providers: [
    PagarmeProvider,
    StripeProvider,
    {
      provide: 'PAYMENT_GATEWAYS',
      useFactory: (pagarme: PagarmeProvider, stripe: StripeProvider) => [
        pagarme,
        stripe,
      ],
      inject: [PagarmeProvider, StripeProvider],
    },
    PaymentsService,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
