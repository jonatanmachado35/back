import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../common/database/supabase.module';
import { UserRole } from '../../common/enums/user-role.enum';
import { PasswordUtil } from '../../common/utils/password.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  whatsapp_number?: string | null;
  roles: UserRole[] | null;
  active_plan_id?: string | null;
  professional_profile?: Record<string, unknown> | null;
  patient_profile?: Record<string, unknown> | null;
  patient_profile_completion?: number | null;
  created_at: string | null;
  updated_at: string | null;
};

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly tableName = 'users';

  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('id')
      .contains('roles', [UserRole.ADMIN])
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to verify admin user: ${error.message}`,
      );
    }

    if (data) {
      return;
    }

    await this.create({
      name: 'ZapNutre Admin',
      email: 'admin@zapnutre.com',
      password: 'ChangeMe123',
      roles: [UserRole.ADMIN],
    });
  }

  async create(payload: CreateUserDto): Promise<User> {
    const existing = await this.findByEmail(payload.email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await PasswordUtil.hash(payload.password);
    const roles = payload.roles?.length ? payload.roles : [UserRole.PATIENT];

    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        name: payload.name,
        email: payload.email.toLowerCase(),
        password_hash: passwordHash,
        whatsapp_number: payload.whatsappNumber,
        roles,
      })
      .select('*')
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to create user: ${error.message}`,
      );
    }

    return this.mapToUser(data as UserRow);
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to load users: ${error.message}`,
      );
    }

    return (data as UserRow[]).map((row) => this.mapToUser(row));
  }

  toPublicUser(user: User) {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }

  async findById(id: string): Promise<User> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to load user ${id}: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.mapToUser(data as UserRow);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to lookup user by email: ${error.message}`,
      );
    }

    if (!data) {
      return undefined;
    }

    return this.mapToUser(data as UserRow);
  }

  async update(id: string, payload: UpdateUserDto): Promise<User> {
    const updateData: Record<string, unknown> = {};

    if (payload.name !== undefined) {
      updateData.name = payload.name;
    }

    if (payload.email !== undefined) {
      updateData.email = payload.email.toLowerCase();
    }

    if (payload.whatsappNumber !== undefined) {
      updateData.whatsapp_number = payload.whatsappNumber;
    }

    if (payload.roles !== undefined) {
      updateData.roles = payload.roles;
    }

    if (payload.activePlanId !== undefined) {
      updateData.active_plan_id = payload.activePlanId;
    }

    if (payload.professionalProfile !== undefined) {
      updateData.professional_profile = payload.professionalProfile;
    }

    if (payload.patientProfile !== undefined) {
      updateData.patient_profile = payload.patientProfile;
    }

    if (payload.patientProfileCompletion !== undefined) {
      updateData.patient_profile_completion = payload.patientProfileCompletion;
    }

    if (payload.password) {
      updateData.password_hash = await PasswordUtil.hash(payload.password);
    }

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to update user ${id}: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.mapToUser(data as UserRow);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new InternalServerErrorException(
        `Failed to delete user ${id}: ${error.message}`,
      );
    }
  }

  private mapToUser(record: UserRow): User {
    return {
      id: record.id,
      name: record.name,
      email: record.email,
      passwordHash: record.password_hash,
      whatsappNumber: record.whatsapp_number ?? undefined,
      roles: record.roles ?? [],
      activePlanId: record.active_plan_id ?? undefined,
      professionalProfile: (record.professional_profile as User['professionalProfile']) ?? undefined,
      patientProfile: (record.patient_profile as User['patientProfile']) ?? undefined,
      patientProfileCompletion: record.patient_profile_completion ?? undefined,
      createdAt: record.created_at ? new Date(record.created_at) : new Date(),
      updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
    } as User;
  }
}
