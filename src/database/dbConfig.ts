import { Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const logger = new Logger('Database');

// Validate environment variables
const requiredEnvVars = ['POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_USERNAME', 'POSTGRES_PASSWORD', 'POSTGRES_DATABASE'];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    logger.error(`Environment variable ${varName} is not set.`);
    throw new Error(`Environment variable ${varName} is not set.`);
  }
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  logging: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(() => {
    logger.log('Data Source has been initialized successfully.');
  })
  .catch((err) => {
    logger.error('Error during Data Source initialization');
    logger.error(err.message);
    throw new Error('Failed to initialize Data Source');
  });

export default dataSource;
