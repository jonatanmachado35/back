import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  professionalProfile?: {
    bio?: string;
    crn?: string;
    areasOfExpertise?: string[];
  };

  @IsOptional()
  patientProfile?: {
    dateOfBirth?: string;
    weightKg?: number;
    heightCm?: number;
    goals?: string[];
  };

  @IsOptional()
  @IsString()
  activePlanId?: string;

  @IsOptional()
  @IsNumber()
  patientProfileCompletion?: number;
}
