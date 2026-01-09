import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

// Load environment variables from .env file (if it exists)
try {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
} catch (error) {
  console.warn('No .env file found, using environment variables from system');
}

const currentDir = process.cwd();

// Set NODE_ENV to migration if running migrations
if (process.argv.some((arg) => arg.includes('migration'))) {
  process.env.NODE_ENV = 'migration';
}

export default new DataSource({
  name: 'default',
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USER || 'digital',
  password: process.env.DATABASE_PASSWORD || 'VlRjUkAX7u8M##',
  database: process.env.DATABASE_NAME || 'digital',
  synchronize: false,
  entities: [path.join(currentDir, 'src/**/*.entity{.ts,.js}')],
  migrations: [path.join(currentDir, 'src/migrations/*{.ts,.js}')],
});
