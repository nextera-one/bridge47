import GeneratorHelper from '../utils/generator.helper';

/**
 * Generates the string content for a TypeORM auditing entity class.
 * This class is used by the 'typeorm-auditing' library to log changes to the main entity.
 * @param {string} tableName - The snake_case name of the database table for the main entity.
 * @returns {string} A string containing the full TypeScript code for the audit entity.
 */
export function generateAuditEntity(tableName: string): string {
  const className = GeneratorHelper.snakeToPascal(tableName);
  return `
import { AuditingAction, AuditingEntityDefaultColumns } from 'typeorm-auditing';
import { AuditEntity } from '../../common/decorators/audit-entity.decorator';
import { ${className} } from './${tableName}.entity';

/**
 * Audit entity for tracking changes to the ${className} entity.
 * Each instance of this class represents a single change (INSERT, UPDATE, or DELETE)
 * to a ${className} record.
 */
@AuditEntity(${className})
export class ${className}Audit
  extends ${className}
  implements AuditingEntityDefaultColumns
{
  /**
   * A sequence number for tracking the order of modifications, managed by the auditing library.
   * @readonly
   */
  readonly _seq: number;

  /**
   * The type of action that was performed (e.g., 'INSERT', 'UPDATE', 'DELETE').
   * @readonly
   */
  readonly _action: AuditingAction;
  
  /**
   * The timestamp indicating when the modification occurred.
   * @readonly
   */
  readonly _modifiedAt: Date;
}
  `;
}