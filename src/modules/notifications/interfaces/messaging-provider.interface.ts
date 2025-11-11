export interface MessagingProvider {
  readonly name: string;
  sendMessage(to: string, message: string): Promise<void>;
  sendTemplate?(to: string, template: string, variables?: Record<string, string>): Promise<void>;
}
