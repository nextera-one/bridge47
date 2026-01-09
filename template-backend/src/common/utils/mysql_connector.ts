import {
  Connection,
  FieldPacket,
  RowDataPacket,
  createConnection,
} from 'mysql2/promise';

import StringUtil from './string.util';

const connectionConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || '',
};

interface TableColumn {
  name: string;
  type: string;
  required: boolean;
  dbType?: string;
}

async function getAllTables(): Promise<string[]> {
  const connection: Connection = await createConnection(connectionConfig);

  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] =
      await connection.execute('SHOW TABLES');
    return rows.map((row) => Object.values(row)[0] as string);
  } catch (error) {
    throw error;
  } finally {
    connection.end();
  }
}

async function getColumnsForTable(tableName: string): Promise<TableColumn[]> {
  const connection: Connection = await createConnection(connectionConfig);

  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      `DESCRIBE ${tableName}`,
    );
    return rows.map((row) => {
      const obj = {
        name: row.Field,
        type: mapToTypeScriptType(row.Type),
        required: row.Null === 'NO',
        dbType: row.Type,
      } as TableColumn;
      return obj;
    });
  } catch (error) {
    throw error;
  } finally {
    connection.end();
  }
}

const mySqlToNestTypeMap: { [key: string]: string } = {
  int: 'number',
  float: 'number',
  double: 'number',
  decimal: 'number',
  varchar: 'string',
  string: 'string',
  bit: 'boolean',
  text: 'string',
  date: 'Date',
  datetime: 'Date',
  timestamp: 'Date',
  boolean: 'boolean',
  json: 'any',
  enum: 'string',
  longtext: 'string',
};

function mapToTypeScriptType(databaseType: string): string {
  const lowerCaseType = databaseType.toLowerCase();
  const keys = Object.keys(mySqlToNestTypeMap);
  for (
    let index = 0;
    index < keys.length;
    index++ // for (const key of keys)
  ) {
    const key = keys[index];
    if (lowerCaseType.includes(key)) {
      return mySqlToNestTypeMap[key];
    }
  }
  // console.log(lowerCaseType, '<=====');
  return 'any'; // Default to 'any' for unsupported types
}

function generateNestDtoClass(
  tableName: string,
  fields: TableColumn[],
): string {
  const className = StringUtil.camelToPascal(`${tableName}Dto`);
  let dtoClass = `import { Transform, TransformFnParams } from 'class-transformer';\n
                  import { BaseDto } from '../../base/base.dto';\n
                  import DtoUtil from '../../util/DtoUtil';\n
                  import { ApiProperty } from '@nestjs/swagger';\n
                  import { IsEnum, IsJSON, IsString, IsBoolean, IsNumber, IsOptional, IsDate } from 'class-validator';\n\n`;
  dtoClass += `export class ${className} extends BaseDto{\n`;

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (
      [
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
        'id',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
      ].includes(field.name)
    ) {
      continue;
    }
    const optional = field.required ? '' : '?';
    const typeDecorator = `${getDecoratorIsOptional(
      field,
    )}\n${getDecoratorBasedOnType(field)}\n@ApiProperty(${
      field.required
        ? `{description : '${toTitleCase(
            field.name,
          )}', example: '${getFieldExample(field)}'}`
        : `{ description : '${toTitleCase(
            field.name,
          )}', example: '${getFieldExample(field)}', required: false }`
    })`;
    dtoClass += `  ${typeDecorator}\n`;
    const fieldCamelCase = StringUtil.snakeToCamel(field.name);
    dtoClass += `  ${fieldCamelCase}${optional}: ${field.type};\n\n`;
  }

  dtoClass += '}\n\n';

  return dtoClass;
}

//get field ecample based on type
function getFieldExample(field: TableColumn): string | Date | number | boolean {
  switch (field.type) {
    case 'string':
      return 'string';
    case 'number':
      return 0.0;
    case 'Date':
      return new Date();
    case 'boolean':
      return true;
    default:
      return '';
  }
}

function toTitleCase(field: string): string {
  return field
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export {
  TableColumn,
  generateNestDtoClass,
  getAllTables,
  getColumnsForTable,
  mapToTypeScriptType,
};

function getDecoratorIsOptional(field: TableColumn) {
  if (!field.required) return '@IsOptional()';
  return '';
}

function getDecoratorBasedOnType(field: TableColumn) {
  switch (field.type) {
    case 'string':
      return '@IsString()';
    case 'number':
      return '@IsNumber()';
    case 'Date':
      return '@IsDate()';
    case 'boolean':
      return '@Transform((value: TransformFnParams) => DtoUtil.bufferToBoolean(value.value))\n@IsBoolean()';
    case 'any':
      return '@IsJSON()';
    default:
      return '';
  }
}
