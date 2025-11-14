import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: SUPABASE_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): SupabaseClient => {
        const url = configService.get<string>('supabase.url');
        const serviceKey = configService.get<string>('supabase.serviceRoleKey');
        const anonKey = configService.get<string>('supabase.anonKey');
        const key = serviceKey ?? anonKey;

        if (!url || !key) {
          throw new Error('Supabase credentials are not configured');
        }

        return createClient(url, key, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
          },
        });
      },
    },
  ],
  exports: [SUPABASE_CLIENT],
})
export class SupabaseModule {}
