import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './common/database/supabase.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AnamnesisModule } from './modules/anamnesis/anamnesis.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PatientsModule } from './modules/patients/patients.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PlansModule } from './modules/plans/plans.module';
import { UsersModule } from './modules/users/users.module';
import configuration from './common/utils/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    PatientsModule,
    PlansModule,
    PaymentsModule,
    NotificationsModule,
    AnamnesisModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
