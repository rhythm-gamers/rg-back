import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseConnection: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username:process.env.DATABASE_USER,
  password:process.env.DATABASE_PASS,
  database:process.env.DATABASE_DATABASE,
  entities: [ 'dist/**/*.entity.ts' ],
  synchronize: process.env.IS_DEVELOPE === 'dev' ? true : false
};