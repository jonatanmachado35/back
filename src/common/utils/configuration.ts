export default () => ({
  http: {
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  },
});
