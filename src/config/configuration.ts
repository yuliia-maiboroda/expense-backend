export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3001,
  jwt: {
    jwtAccessKey: process.env.JWT_ACCESS_SECRET_KEY,
    jwtAccessLifetime: Number(process.env.JWT_ACCESS_LIFETIME),
    jwtRefreshKey: process.env.JWT_REFRESH_SECRET_KEY,
    jwtRefreshLifetime: Number(process.env.JWT_REFRESH_LIFETIME),
  },
  database: {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
    ssl: { rejectUnauthorized: Boolean(process.env.POSTGRES_SSL) },
  },
});
