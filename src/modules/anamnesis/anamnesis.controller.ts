import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAnamnesisDto } from './dto/create-anamnesis.dto';
import { AnamnesisService } from './anamnesis.service';

@Controller('anamnesis')
export class AnamnesisController {
  constructor(private readonly anamnesisService: AnamnesisService) {}

  @Post()
  create(@Body() payload: CreateAnamnesisDto) {
    return this.anamnesisService.create(payload);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.anamnesisService.findByUserId(userId);
  }
}
