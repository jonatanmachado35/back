import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { WhatsappProvider } from './providers/whatsapp.provider';

@Module({
  controllers: [NotificationsController],
  providers: [
    WhatsappProvider,
    {
      provide: 'MESSAGING_PROVIDERS',
      useFactory: (whatsapp: WhatsappProvider) => [whatsapp],
      inject: [WhatsappProvider],
    },
    NotificationsService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
