import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';
import { InMemoryRepository } from '../../common/persistence/in-memory.repository';
import { PasswordUtil } from '../../common/utils/password.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly repository = new InMemoryRepository<User>();

  constructor() {
    this.seed();
  }

  private async seed() {
    const adminExists = await this.repository.findOne((user) =>
      user.roles.includes(UserRole.ADMIN),
    );
    if (!adminExists) {
      await this.create({
        name: 'ZapNutre Admin',
        email: 'admin@zapnutre.com',
        password: 'ChangeMe123',
        roles: [UserRole.ADMIN],
      });
    }
  }

  async create(payload: CreateUserDto): Promise<User> {
    const passwordHash = await PasswordUtil.hash(payload.password);
    const roles = payload.roles?.length ? payload.roles : [UserRole.PATIENT];

    return this.repository.create({
      name: payload.name,
      email: payload.email.toLowerCase(),
      passwordHash,
      whatsappNumber: payload.whatsappNumber,
      roles,
    });
  }

  async findAll(): Promise<User[]> {
    return this.repository.findAll();
  }

  toPublicUser(user: User) {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne((user) => user.email === email.toLowerCase());
  }

  async update(id: string, payload: UpdateUserDto): Promise<User> {
    const updateData: Partial<User> = { ...payload } as Partial<User>;

    if (payload.password) {
      updateData.passwordHash = await PasswordUtil.hash(payload.password);
      delete (updateData as any).password;
    }

    return this.repository.update(id, updateData);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
