import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryRepository } from '../../common/persistence/in-memory.repository';
import { CreateAnamnesisDto } from './dto/create-anamnesis.dto';
import { Anamnesis } from './entities/anamnesis.entity';

@Injectable()
export class AnamnesisService {
  private readonly repository = new InMemoryRepository<Anamnesis>();

  async create(payload: CreateAnamnesisDto) {
    return this.repository.create({

      dadosPessoais: payload.dadosPessoais,
      estiloVida: payload.estiloVida,
      habitosAlimentares: payload.habitosAlimentares,
      historicoSaude: payload.historicoSaude,
      objetivos: payload.objetivos,
    });
  }

  async findByUserId(userId: string) {
    const anamnesis = await this.repository.findOne((item) => item.userId === userId);
    if (!anamnesis) {
      throw new NotFoundException(`Anamnesis for user ${userId} not found`);
    }

    return anamnesis;
  }
}
