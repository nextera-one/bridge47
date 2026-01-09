import { ColumnSchema } from '../database/schema.reader';
import GeneratorHelper from '../utils/generator.helper';

/**
 * Provides an example value for a given TypeScript type string.
 * Used for generating example values in Swagger API documentation.
 * @param {string} type - The TypeScript type ('string', 'number', 'boolean', 'Date').
 * @returns {any} An example value corresponding to the type.
 */
const getExample = (type: string): any => {
    switch (type) {
      case "string": return "abc";
      case "number": return 123;
      case "boolean": return true;
      case "Date": return "2025-01-01T00:00:00Z";
      default: return "example";
    }
};

/**
 * Creates TypeScript enum definitions from database columns of type 'enum'.
 * @param {string} tableName - The name of the database table (for context, though not directly used in logic).
 * @param {ColumnSchema[]} columns - An array of column schema objects for the table.
 * @returns {Map<string, string>} A map where the key is the column name and the value is the complete string definition of the TypeScript enum.
 */
export function createEnums(tableName: string, columns: ColumnSchema[]): Map<string, string> {
  const enums: Map<string, string> = new Map();
  columns.forEach((col) => {
    if (col.type.includes("enum")) {
      const enumValues = GeneratorHelper.extractEnumValues(col.type) || [];
      let enumValue = `\n export enum ${GeneratorHelper.snakeToPascal(col.name)}Enum {`;
      enumValues.forEach((value) => {
        // Formats the enum key to be a valid TypeScript enum member name (UPPER_SNAKE_CASE)
        enumValue += `  ${value.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^(\d)/, "_$1")} = '${value}',`;
      });
      enumValue += "}\n";
      enums.set(col.name, enumValue);
    }
  });
  return enums;
}

/**
 * Generates the full string content for Create, Read, and Update Data Transfer Object (DTO) files.
 * It automatically adds NestJS class-validator and swagger decorators based on column schemas.
 * @param {string} tableName - The name of the database table.
 * @param {ColumnSchema[]} columns - An array of column schema objects for the table.
 * @returns {{ createDto: string; readDto: string; updateDto: string }} An object containing the complete string content for each DTO file.
 */
export function generateDTO(tableName: string, columns: ColumnSchema[]): { createDto: string; readDto: string; updateDto: string } {
    // Exclude common base entity columns from DTOs
    const excludedColumns = ["id", "created_at", "created_by", "updated_at", "updated_by", "partner", "partner_data", "log", "log_data"];
    
    // Collect all validators used to build import statement
    const usedValidators = new Set<string>(['IsOptional']);
    
    // Helper to add validator and track usage
    const addValidator = (name: string) => {
        usedValidators.add(name);
        return `@${name}`;
    };
    
    // Generate validation decorators based on column type and name
    const generateValidators = (col: ColumnSchema): string => {
        const type = GeneratorHelper.mapMysqlTypeToTsType(col.type);
        const colName = col.name.toLowerCase();
        const length = GeneratorHelper.extractLength(col.type);
        const decorators: string[] = [];
        
        // Type-based validators
        if (col.type.toLowerCase().includes("enum")) {
            decorators.push(addValidator(`IsEnum(${GeneratorHelper.snakeToPascal(col.name)}Enum)`));
            usedValidators.add('IsEnum');
        } else {
            switch (type) {
                case "number":
                case "bigint":
                    decorators.push(addValidator('IsNumber()'));
                    usedValidators.add('IsNumber');
                    // Add Min/Max for common patterns
                    if (colName.includes('age')) {
                        decorators.push('@Min(0)', '@Max(150)');
                        usedValidators.add('Min');
                        usedValidators.add('Max');
                    } else if (colName.includes('quantity') || colName.includes('count')) {
                        decorators.push('@Min(0)');
                        usedValidators.add('Min');
                    }
                    break;
                    
                case "boolean":
                    decorators.push(`@Transform((value: TransformFnParams) => DtoUtil.bufferToBoolean(value.value))`);
                    decorators.push(addValidator('IsBoolean()'));
                    usedValidators.add('IsBoolean');
                    break;
                    
                case "Date":
                    decorators.push(addValidator('IsDate()'));
                    usedValidators.add('IsDate');
                    break;
                    
                case "string":
                default:
                    // Name-based smart validators
                    if (colName.includes('email')) {
                        decorators.push(addValidator('IsEmail()'));
                        usedValidators.add('IsEmail');
                    } else if (colName.includes('url') || colName.includes('link') || colName.includes('website')) {
                        decorators.push(addValidator('IsUrl()'));
                        usedValidators.add('IsUrl');
                    } else if (colName.includes('uuid') || colName === 'id' || colName.endsWith('_id')) {
                        decorators.push(addValidator('IsUUID()'));
                        usedValidators.add('IsUUID');
                    } else if (colName.includes('phone')) {
                        decorators.push(addValidator('IsPhoneNumber()'));
                        usedValidators.add('IsPhoneNumber');
                    } else {
                        decorators.push(addValidator('IsString()'));
                        usedValidators.add('IsString');
                    }
                    
                    // Add length constraints for varchar columns
                    if (length) {
                        decorators.push(`@MaxLength(${length})`);
                        usedValidators.add('MaxLength');
                        // Add MinLength for required string fields
                        if (!col.nullable && length > 1) {
                            decorators.push('@MinLength(1)');
                            usedValidators.add('MinLength');
                        }
                    }
                    break;
            }
        }
        
        // Add @IsOptional for nullable columns
        if (col.nullable) {
            decorators.push(addValidator('IsOptional()'));
        }
        
        return decorators.join('\n  ');
    };

    // Generate property definitions
    const generateProperty = (col: ColumnSchema): string => {
        const type = GeneratorHelper.mapMysqlTypeToTsType(col.type);
        const isEnum = col.type.toLowerCase().includes('enum');
        const tsType = isEnum ? `${GeneratorHelper.snakeToPascal(col.name)}Enum` : type;
        const validators = generateValidators(col);
        
        return `
  @ApiProperty({ description: '${col.name}', example: ${isEnum ? `Object.values(${GeneratorHelper.snakeToPascal(col.name)}Enum)` : `'${getExample(type)}'`} })
  ${validators}
  ${col.name}: ${tsType}${col.nullable ? ' | null' : ''};
`;
    };

    // Build DTO bodies
    let createDtoBody = `export class Create${GeneratorHelper.snakeToPascal(tableName)}Dto extends BaseDto {\n`;
    let readDtoBody = `export class Read${GeneratorHelper.snakeToPascal(tableName)}Dto extends ReadBaseDto {\n`;

    columns
        .filter((col) => !excludedColumns.includes(col.name))
        .forEach((col) => {
            const propDef = generateProperty(col);
            createDtoBody += propDef;
            readDtoBody += propDef;
        });

    createDtoBody += "}\n";
    readDtoBody += "}\n";

    // Build dynamic import statement based on used validators
    const validatorImports = Array.from(usedValidators)
        .filter(v => !v.includes('(')) // Filter out decorators with params
        .sort()
        .join(', ');
    
    // Enum imports
    const enums = columns.filter((col) => col.type.toLowerCase().includes("enum"));
    const enumImports = enums.length > 0 
        ? enums.map(e => `import { ${GeneratorHelper.snakeToPascal(e.name)}Enum } from '../enums/${e.name}.enum';`).join("\n") + '\n'
        : '';

    const baseImports = `import { ApiProperty } from '@nestjs/swagger';
import { ${validatorImports} } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import DtoUtil from '../../common/utils/dto.util';
`;

    const createDtoImports = baseImports + `import { BaseDto } from '../../base/base.dto';\n` + enumImports;
    const readDtoImports = baseImports + `import { ReadBaseDto } from '../../base/read-base.dto';\n` + enumImports;

    // Generate the Update DTO using NestJS's PartialType for convenience
    const updateDto = `import { PartialType } from '@nestjs/swagger';
import { Create${GeneratorHelper.snakeToPascal(tableName)}Dto } from './create-${tableName}.dto';

export class Update${GeneratorHelper.snakeToPascal(tableName)}Dto extends PartialType(Create${GeneratorHelper.snakeToPascal(tableName)}Dto) {}
`;

    return { createDto: createDtoImports + createDtoBody, readDto: readDtoImports + readDtoBody, updateDto };
}