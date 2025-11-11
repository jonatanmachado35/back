import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { PasswordUtil } from '../../common/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(payload: RegisterDto) {
    const user = await this.usersService.create(payload);
    return this.usersService.toPublicUser(user);
  }

  async login(payload: LoginDto) {
    const user = await this.usersService.findByEmail(payload.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await PasswordUtil.compare(payload.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      secret: this.configService.get('auth.jwtSecret'),
      expiresIn: this.configService.get('auth.jwtExpiresIn'),
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    };
  }
}
