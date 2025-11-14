import { Entity } from '../../../common/interfaces/entity.interface';
import { UserRole } from '../../../common/enums/user-role.enum';

export interface User extends Entity {
  name: string;
  email: string;
  passwordHash: string;
  whatsappNumber?: string;
  roles: UserRole[];
  activePlanId?: string;
  professionalProfile?: {
    bio?: string;
    crn?: string;
    areasOfExpertise?: string[];
  };
  patientProfile?: {
    dateOfBirth?: string;
    weightKg?: number;
    heightCm?: number;
    goals?: string[];
  };
  patientProfileCompletion?: number;
}
