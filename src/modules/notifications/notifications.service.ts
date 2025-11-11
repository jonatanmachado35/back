import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MessagingProvider } from './interfaces/messaging-provider.interface';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('MESSAGING_PROVIDERS')
    private readonly providers: MessagingProvider[],
  ) {}

  private resolveProvider(name: string): MessagingProvider {
    const provider = this.providers.find((item) => item.name === name);
    if (!provider) {
      throw new NotFoundException(`Messaging provider ${name} not configured`);
    }
    return provider;
  }

  async sendVia(providerName: string, payload: SendNotificationDto) {
    const provider = this.resolveProvider(providerName);

    if (payload.template && provider.sendTemplate) {
      await provider.sendTemplate(payload.to, payload.template, payload.variables);
    } else {
      await provider.sendMessage(payload.to, payload.message);
    }

    return { provider: provider.name, delivered: true };
  }
}
