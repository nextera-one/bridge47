import GeneratorHelper from '../utils/generator.helper';

/**
 * Generates a NestJS module class string for a given database table.
 * This module encapsulates the controller, service, entity, and subscriber.
 * @param {string} tableName - The name of the database table (e.g., 'user_profiles').
 * @param {boolean} [global] - If true, the module will be registered as a global module.
 * @returns {string} A string containing the full TypeScript code for the module.
 */
export function generateModule(tableName: string, global?: boolean): string {
  const className = GeneratorHelper.snakeToPascal(tableName);
  return `
import { ${global ? 'Global, ' : ''}Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${className}Service } from './${tableName}.service';
import { ${className}Controller } from './${tableName}.controller';
import { ${className} } from './entities/${tableName}.entity';
import { ${className}Subscriber } from "./subscribers/${tableName}.subscriber";

${global ? '@Global()' : ''}
@Module({
  imports: [TypeOrmModule.forFeature([${className}])],
  controllers: [${className}Controller],
  providers: [${className}Service, ${className}Subscriber],
  exports: [${className}Service],
})
export class ${className}Module {}
`;
}