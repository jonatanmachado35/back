import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ enum: UserRole, isArray: true, example: [UserRole.NUTRITIONIST] })
  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];

  @ApiPropertyOptional({ example: 'NovaSenha123' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    example: {
      bio: 'Nutricionista esportivo',
      crn: '12345',
      areasOfExpertise: ['emagrecimento', 'hipertrofia'],
    },
  })
  @IsOptional()
  professionalProfile?: {
    bio?: string;
    crn?: string;
    areasOfExpertise?: string[];
  };

  @ApiPropertyOptional({
    example: {
      dateOfBirth: '1990-05-20',
      weightKg: 72.5,
      heightCm: 175,
      goals: ['perder gordura'],
    },
  })
  @IsOptional()
  patientProfile?: {
    dateOfBirth?: string;
    weightKg?: number;
    heightCm?: number;
    goals?: string[];
  };

  @ApiPropertyOptional({ example: 'plan_123' })
  @IsOptional()
  @IsString()
  activePlanId?: string;

  @ApiPropertyOptional({ example: 75 })
  @IsOptional()
  @IsNumber()
  patientProfileCompletion?: number;
}
