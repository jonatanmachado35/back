import { Injectable, Logger } from '@nestjs/common';
import { MessagingProvider } from '../interfaces/messaging-provider.interface';

@Injectable()
export class WhatsappProvider implements MessagingProvider {
  readonly name = 'whatsapp';

  async sendMessage(to: string, message: string): Promise<void> {
    Logger.log(`Sending WhatsApp message to ${to}: ${message}`, WhatsappProvider.name);
  }

  async sendTemplate(
    to: string,
    template: string,
    variables: Record<string, string> = {},
  ): Promise<void> {
    Logger.log(
      `Sending WhatsApp template ${template} to ${to} with ${JSON.stringify(variables)}`,
      WhatsappProvider.name,
    );
  }
}
