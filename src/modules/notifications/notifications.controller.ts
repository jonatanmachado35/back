import { Body, Controller, Param, Post } from '@nestjs/common';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post(':provider')
  sendNotification(
    @Param('provider') provider: string,
    @Body() payload: SendNotificationDto,
  ) {
    return this.notificationsService.sendVia(provider, payload);
  }
}
