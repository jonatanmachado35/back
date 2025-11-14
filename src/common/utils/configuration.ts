export default () => ({
  http: {
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  },
  supabase: {
    url: process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_SERVICE_KEY ??
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
    anonKey:
      process.env.SUPABASE_ANON_KEY ??
      process.env.SUPABASE_KEY ??
      process.env.VITE_SUPABASE_ANON_KEY,
  },
});
