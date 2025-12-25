import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ example: '+5511999999999' })
  @IsString()
  to!: string;

  @ApiProperty({ example: 'Sua consulta esta confirmada para amanha.' })
  @IsString()
  message!: string;

  @ApiPropertyOptional({ example: 'consulta_confirmada' })
  @IsOptional()
  @IsString()
  template?: string;

  @ApiPropertyOptional({ example: { nome: 'Joao', data: '2024-02-01' } })
  @IsOptional()
  @IsObject()
  variables?: Record<string, string>;
}
