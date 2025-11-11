import { Injectable } from '@nestjs/common';
import { PaymentsService } from '../payments/payments.service';
import { PatientsService } from '../patients/patients.service';
import { PlansService } from '../plans/plans.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly paymentsService: PaymentsService,
    private readonly plansService: PlansService,
  ) {}

  async getDashboard() {
    const [patients, payments, plans] = await Promise.all([
      this.patientsService.findAll(),
      this.paymentsService.findAll(),
      this.plansService.findAll(),
    ]);

    const activePatients = patients.length;
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const planUsage = plans.map((plan) => ({
      planId: plan.id,
      name: plan.name,
      audience: plan.audience,
      price: plan.price,
      subscriptions: payments.filter((payment) => payment.planId === plan.id).length,
    }));

    const averageWeight = this.calculateAverageWeight(patients);

    return {
      activePatients,
      totalRevenue,
      averageWeight,
      planUsage,
    };
  }

  private calculateAverageWeight(patients: Awaited<ReturnType<PatientsService['findAll']>>) {
    const metrics = patients.flatMap((patient) => patient.healthMetrics);
    if (!metrics.length) {
      return null;
    }

    const weights = metrics
      .map((metric) => metric.weightKg)
      .filter((weight): weight is number => typeof weight === 'number');

    if (!weights.length) {
      return null;
    }

    const sum = weights.reduce((acc, current) => acc + current, 0);
    return Number((sum / weights.length).toFixed(2));
  }
}
