import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateAnamnesisDto } from './dto/create-anamnesis.dto';
import { AnamnesisService } from './anamnesis.service';

const anamnesisExample = {
  id: 'anamnesis_123',
  userId: 'user_123',
  objective: 'perder gordura',
  dietaryRestrictions: 'lactose',
  preferences: 'comida caseira',
  motivation: 'melhorar saude',
  answers: [
    { question: 'dadosPessoais.idade', answer: '30' },
    { question: 'historicoSaude.alergias', answer: 'lactose' },
  ],
  createdAt: '2024-02-01T10:00:00.000Z',
  updatedAt: '2024-02-01T10:00:00.000Z',
};

@ApiTags('Anamnesis')
@Controller('anamnesis')
export class AnamnesisController {
  constructor(private readonly anamnesisService: AnamnesisService) {}

  @Post()
  @ApiCreatedResponse({ schema: { example: anamnesisExample } })
  create(@Body() payload: CreateAnamnesisDto) {
    return this.anamnesisService.create(payload);
  }

  @Get('user/:userId')
  @ApiOkResponse({ schema: { example: anamnesisExample } })
  findByUser(@Param('userId') userId: string) {
    return this.anamnesisService.findByUserId(userId);
  }
}
