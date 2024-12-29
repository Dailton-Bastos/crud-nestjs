import { registerAs } from '@nestjs/config';

export default registerAs('globalConfig', () => ({
  database: {
    type: process.env.DATABASE_TYPE as 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    autoLoadEntities: Boolean(process.env.DATABASE_TYPE),
    synchronize: Boolean(process.env.DATABASE_TYPE),
  },
}));