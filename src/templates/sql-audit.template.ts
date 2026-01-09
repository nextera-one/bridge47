import { ColumnSchema } from '../database/schema.reader';
import { config } from '../generator.config';

export function generateAuditTableSQL(
  tableName: string,
  columns: ColumnSchema[],
): string {
  const dbName = config.db.database;
  let auditTableSQL = `DROP TABLE IF EXISTS \`${dbName}_audit\`.\`${tableName}_audit\`;\n\n`;
  auditTableSQL += `CREATE TABLE \`${dbName}_audit\`.\`${tableName}_audit\` (\n`;

  columns.forEach((col) => {
    auditTableSQL += `  \`${col.name}\` ${col.type} DEFAULT NULL,\n`;
  });

  auditTableSQL += `  \`_seq\` bigint NOT NULL AUTO_INCREMENT,\n`;
  auditTableSQL += `  \`_action\` enum('Create','Update','Delete') NOT NULL DEFAULT 'Create',\n`;
  auditTableSQL += `  \`_modifiedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n`;
  auditTableSQL += `  PRIMARY KEY (\`_seq\`),\n`;
  auditTableSQL += `  UNIQUE KEY \`_seq_UNIQUE\` (\`_seq\`)\n`;
  auditTableSQL += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;\n`;

  return auditTableSQL;
}