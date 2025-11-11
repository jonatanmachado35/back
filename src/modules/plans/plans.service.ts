import { Injectable } from '@nestjs/common';
import { BillingCycle } from '../../common/enums/billing-cycle.enum';
import { InMemoryRepository } from '../../common/persistence/in-memory.repository';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlansService {
  private readonly repository = new InMemoryRepository<Plan>();

  constructor() {
    this.seed();
  }

  private async seed() {
    const plans = await this.repository.findAll();
    if (plans.length > 0) {
      return;
    }

    const basePlans: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'ZapNutre Pessoal Mensal',
        description: 'Plano individual para acompanhamento mensal',
        audience: 'b2c',
        price: 49.9,
        billingCycle: BillingCycle.MONTHLY,
        benefits: [
          'Dashboard com evolução de peso e medidas',
          'Plano alimentar personalizado',
          'Acesso ao ZapNutre via WhatsApp',
        ],
        discountPercentage: 0,
      },
      {
        name: 'ZapNutre Pessoal Anual',
        description: 'Economia para acompanhamento durante todo o ano',
        audience: 'b2c',
        price: 329.0,
        billingCycle: BillingCycle.ANNUAL,
        benefits: [
          'Tudo do plano mensal',
          'Bônus: 2 revisões adicionais com nutricionista',
          'Acesso prioritário ao suporte',
        ],
        discountPercentage: 15,
      },
      {
        name: 'ZapNutre Expert',
        description: 'Plano profissional para nutricionistas',
        audience: 'professional',
        price: 229.9,
        billingCycle: BillingCycle.MONTHLY,
        benefits: [
          'Cadastro e acompanhamento de pacientes',
          'Relatórios inteligentes e lembretes automáticos',
          'Envio de planos personalizados e check-ins automáticos',
        ],
        commissionPercentage: 50,
      },
      {
        name: 'ZapNutre Expert Anual',
        description: 'Economia para nutricionistas com pagamento anual',
        audience: 'professional',
        price: 2390,
        billingCycle: BillingCycle.ANNUAL,
        benefits: [
          'Tudo do plano mensal',
          'Acesso a atualizações exclusivas',
          'Relatórios trimestrais de performance dos pacientes',
        ],
        commissionPercentage: 50,
      },
    ];

    for (const plan of basePlans) {
      await this.repository.create(plan);
    }
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }
}
