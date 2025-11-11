import { IsObject, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  to!: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  template?: string;

  @IsOptional()
  @IsObject()
  variables?: Record<string, string>;
}
