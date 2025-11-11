import { randomUUID } from 'crypto';
import { Entity } from '../interfaces/entity.interface';

type WithoutDates<T> = Omit<T, 'createdAt' | 'updatedAt'>;

type CreatePayload<T extends Entity> = Omit<WithoutDates<T>, 'id'> & Partial<Pick<T, 'id'>>;

type UpdatePayload<T extends Entity> = Partial<WithoutDates<T>>;

export class InMemoryRepository<T extends Entity> {
  protected readonly items = new Map<string, T>();

  async findAll(): Promise<T[]> {
    return Array.from(this.items.values());
  }

  async findById(id: string): Promise<T | undefined> {
    return this.items.get(id);
  }

  async findOne(predicate: (entity: T) => boolean): Promise<T | undefined> {
    for (const item of this.items.values()) {
      if (predicate(item)) {
        return item;
      }
    }

    return undefined;
  }

  async create(payload: CreatePayload<T>): Promise<T> {
    const now = new Date();
    const id = payload.id ?? randomUUID();
    const entity: T = {
      ...(payload as unknown as Omit<T, 'createdAt' | 'updatedAt'>),
      id,
      createdAt: now,
      updatedAt: now,
    } as T;

    this.items.set(id, entity);
    return entity;
  }

  async update(id: string, payload: UpdatePayload<T>): Promise<T> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Entity with id ${id} not found`);
    }

    const updated: T = {
      ...existing,
      ...(payload as Partial<T>),
      updatedAt: new Date(),
    } as T;

    this.items.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
}
