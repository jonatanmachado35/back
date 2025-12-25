import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationsService } from './notifications.service';

const notificationResponseExample = {
  provider: 'whatsapp',
  delivered: true,
};

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post(':provider')
  @ApiOkResponse({ schema: { example: notificationResponseExample } })
  sendNotification(
    @Param('provider') provider: string,
    @Body() payload: SendNotificationDto,
  ) {
    return this.notificationsService.sendVia(provider, payload);
  }
}
