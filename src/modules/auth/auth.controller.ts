import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

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

const loginResponseExample = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  user: {
    id: 'user_123',
    name: 'Joao Silva',
    email: 'joao.silva@example.com',
    roles: ['paciente'],
  },
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ schema: { example: publicUserExample } })
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  @ApiOkResponse({ schema: { example: loginResponseExample } })
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }
}
