import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
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
  nome: string;
  email: string;
  senha_hash: string;
  telefone?: string | null;
  tipo?: string | null;
  perfis: UserRole[] | null;
  plano_ativo_id?: string | null;
  perfil_profissional?: Record<string, unknown> | null;
  perfil_paciente?: Record<string, unknown> | null;
  perfil_paciente_completude?: number | null;
  criado_em: string | null;
  atualizado_em: string | null;
};

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);
  private readonly tableName = 'usuarios';

  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    // Verifica se existe algum usuário admin
    const { data: users, error } = await this.supabase
      .from(this.tableName)
      .select('id, perfis, email')
      .limit(100);

    if (error) {
      this.logger.error(`Failed to verify admin user: ${error.message}`);
      return; // Don't crash on seed errors
    }

    // Procura por um admin manualmente no array retornado
    // Supabase may return perfis as string or array depending on driver
    const hasAdmin = users?.some(user => {
      let perfis = user.perfis;
      // Handle case where perfis is returned as a string
      if (typeof perfis === 'string') {
        try {
          perfis = JSON.parse(perfis);
        } catch {
          return false;
        }
      }
      return Array.isArray(perfis) && perfis.includes(UserRole.ADMIN);
    });

    if (hasAdmin) {
      this.logger.log('Admin user already exists, skipping seed');
      return;
    }

    // Also check if the email already exists (double safety check)
    const existingAdmin = await this.findByEmail('admin@zapnutre.com');
    if (existingAdmin) {
      this.logger.log('Admin user with email admin@zapnutre.com already exists, skipping seed');
      return;
    }

    try {
      await this.create({
        name: 'ZapNutre Admin',
        email: 'admin@zapnutre.com',
        password: 'ChangeMe123',
        whatsappNumber: '+5511999999999',
        roles: [UserRole.ADMIN],
      });
      this.logger.log('Admin user created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Could not create admin user during seed: ${message}`);
    }
  }

  async create(payload: CreateUserDto): Promise<User> {
    const existing = await this.findByEmail(payload.email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await PasswordUtil.hash(payload.password);
    const roles = payload.roles?.length ? payload.roles : [UserRole.PATIENT];

    // Determine tipo based on roles
    // NOTE: The database tipo_usuario enum only has 'admin' and 'nutricionista'
    // To add 'paciente' support, run: database/add-paciente-to-enum.sql
    let tipo = 'nutricionista'; // Default fallback
    if (roles.includes(UserRole.ADMIN)) {
      tipo = 'admin';
    } else if (roles.includes(UserRole.NUTRITIONIST)) {
      tipo = 'nutricionista';
    } else if (roles.includes(UserRole.PATIENT)) {
      // WORKAROUND: Using 'nutricionista' for patients until enum is updated
      tipo = 'nutricionista';
      this.logger.warn(
        'Using tipo="nutricionista" for patient users. ' +
        'Run database/add-paciente-to-enum.sql to add proper "paciente" enum value.'
      );
    }

    const { data, error} = await this.supabase
      .from(this.tableName)
      .insert({
        nome: payload.name,
        email: payload.email.toLowerCase(),
        senha_hash: passwordHash,
        telefone: payload.whatsappNumber,
        tipo: tipo,
        perfis: roles,
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
      .order('criado_em', { ascending: true });

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
      updateData.nome = payload.name;
    }

    if (payload.email !== undefined) {
      updateData.email = payload.email.toLowerCase();
    }

    if (payload.whatsappNumber !== undefined) {
      updateData.telefone = payload.whatsappNumber;
    }

    if (payload.roles !== undefined) {
      updateData.perfis = payload.roles;
    }

    if (payload.activePlanId !== undefined) {
      updateData.plano_ativo_id = payload.activePlanId;
    }

    if (payload.professionalProfile !== undefined) {
      updateData.perfil_profissional = payload.professionalProfile;
    }

    if (payload.patientProfile !== undefined) {
      updateData.perfil_paciente = payload.patientProfile;
    }

    if (payload.patientProfileCompletion !== undefined) {
      updateData.perfil_paciente_completude = payload.patientProfileCompletion;
    }

    if (payload.password) {
      updateData.senha_hash = await PasswordUtil.hash(payload.password);
    }

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    updateData.atualizado_em = new Date().toISOString();

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
      name: record.nome,
      email: record.email,
      passwordHash: record.senha_hash,
      whatsappNumber: record.telefone ?? undefined,
      roles: record.perfis ?? [],
      activePlanId: record.plano_ativo_id ?? undefined,
      professionalProfile: (record.perfil_profissional as User['professionalProfile']) ?? undefined,
      patientProfile: (record.perfil_paciente as User['patientProfile']) ?? undefined,
      patientProfileCompletion: record.perfil_paciente_completude ?? undefined,
      createdAt: record.criado_em ? new Date(record.criado_em) : new Date(),
      updatedAt: record.atualizado_em ? new Date(record.atualizado_em) : new Date(),
    } as User;
  }
}
