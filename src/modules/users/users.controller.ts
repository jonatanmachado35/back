import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

const publicUserExample = {
  id: 'user_123',
  name: 'Joao Silva',
  email: 'joao.silva@example.com',
  whatsappNumber: '+5511999999999',
  roles: ['paciente'],
  activePlanId: 'plan_123',
  professionalProfile: {
    bio: 'Nutricionista esportivo',
    crn: '12345',
    areasOfExpertise: ['emagrecimento', 'hipertrofia'],
  },
  patientProfile: {
    dateOfBirth: '1990-05-20',
    weightKg: 72.5,
    heightCm: 175,
    goals: ['perder gordura'],
  },
  patientProfileCompletion: 80,
  createdAt: '2024-02-01T10:00:00.000Z',
  updatedAt: '2024-02-01T10:00:00.000Z',
};

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ schema: { example: publicUserExample } })
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload).then((user) => this.usersService.toPublicUser(user));
  }

  @Get()
  @ApiOkResponse({ schema: { example: [publicUserExample] } })
  findAll() {
    return this.usersService
      .findAll()
      .then((users) => users.map((user) => this.usersService.toPublicUser(user)));
  }

  @Get(':id')
  @ApiOkResponse({ schema: { example: publicUserExample } })
  findOne(@Param('id') id: string) {
    return this.usersService
      .findById(id)
      .then((user) => this.usersService.toPublicUser(user));
  }

  @Patch(':id')
  @ApiOkResponse({ schema: { example: publicUserExample } })
  update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.usersService
      .update(id, payload)
      .then((user) => this.usersService.toPublicUser(user));
  }

  @Delete(':id')
  @ApiOkResponse({ schema: { example: null } })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
