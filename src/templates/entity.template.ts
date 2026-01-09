import { FullTableSchema, IndexSchema, RelationSchema, ReferencedBySchema, ManyToManySchema } from '../database/schema.reader';
import GeneratorHelper from '../utils/generator.helper';

/**
 * Generates the complete string content for a TypeORM entity class from a detailed database schema.
 * 
 * Features:
 * - All relationship types: OneToOne, OneToMany, ManyToOne, ManyToMany
 * - Composite and single-column indexes with FULLTEXT/SPATIAL support
 * - Cascade options for relationships
 * - Proper nullable handling for relations
 * - JSON column support
 * - Enum support with generated enums
 * - Binary UUID transformer support
 * - Bit-to-boolean transformer support
 * 
 * @param tableName - The name of the database table
 * @param schema - A comprehensive schema object describing the table's structure
 * @returns A promise that resolves to the complete entity file content
 */
export async function generateEntity(
  tableName: string,
  schema: FullTableSchema
): Promise<string> {
  const { columns, relations, referencedBy, manyToMany = [] } = schema;
  const idxList: IndexSchema[] = (schema as any).indexes ?? [];
  const entityName = GeneratorHelper.snakeToPascal(tableName);
  
  // Track what needs to be imported
  const typeormImports = new Set(['Column', 'Entity']);
  const customImports: string[] = [];
  
  // Columns to skip (handled by Base entity)
  const skipColumns = new Set([
    'id', 'created_at', 'created_by', 'updated_at', 'updated_by',
    'partner', 'partner_data', 'partner_data_id',
    'log', 'log_data', 'logs', 'logs_data', 'errors', 'errors_data',
  ]);
  
  // Foreign key columns to skip (handled by relations)
  const fkColumns = new Set(relations.map(r => r.column));

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 1: Analyze and prepare data
  // ═══════════════════════════════════════════════════════════════════
  
  // Check for needed transformers
  const needsBitTransformer = columns.some(c => c.type.toLowerCase().startsWith('bit'));
  const needsUuidTransformer = columns.some(c => c.type.toLowerCase().startsWith('binary(16)'));
  
  // Check for enums
  const enumColumns = columns.filter(c => c.type.toLowerCase().includes('enum'));
  
  // Check for JSON columns
  const hasJsonColumns = columns.some(c => c.type.toLowerCase() === 'json');
  
  // Gather all related entities
  const relatedEntities = new Set<string>();
  relations.forEach(r => r.referencedTable && r.referencedTable !== tableName && relatedEntities.add(r.referencedTable));
  referencedBy.forEach(r => r.table && r.table !== tableName && relatedEntities.add(r.table));
  manyToMany.forEach(r => r.targetEntity && r.targetEntity !== tableName && relatedEntities.add(r.targetEntity));
  
  // Check what decorators are needed
  if (relations.length > 0) {
    typeormImports.add('JoinColumn');
    relations.forEach(r => typeormImports.add(r.isUnique ? 'OneToOne' : 'ManyToOne'));
  }
  if (referencedBy.length > 0) {
    referencedBy.forEach(r => typeormImports.add(r.isUnique ? 'OneToOne' : 'OneToMany'));
  }
  if (manyToMany.length > 0) {
    typeormImports.add('ManyToMany');
    if (manyToMany.some(r => r.isOwningSide)) {
      typeormImports.add('JoinTable');
    }
  }
  if (idxList.length > 0) {
    typeormImports.add('Index');
  }

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 2: Build imports
  // ═══════════════════════════════════════════════════════════════════
  
  let output = '';
  
  // TypeORM imports
  output += `import { ${Array.from(typeormImports).sort().join(', ')} } from 'typeorm';\n`;
  output += `import { Base } from '../../base/base.entity';\n`;
  
  // Transformer imports
  if (needsBitTransformer) {
    output += `import { BoolBitTransformer } from '../../transformer/bool_bit.transformer';\n`;
  }
  if (needsUuidTransformer) {
    output += `import { uuidV7ValueTransformer } from '../../transformer/uuidv7-binary16.transformer';\n`;
  }
  
  // Enum imports
  enumColumns.forEach(col => {
    output += `import { ${GeneratorHelper.snakeToPascal(col.name)}Enum } from '../enums/${col.name}.enum';\n`;
  });
  
  // Related entity imports
  relatedEntities.forEach(rel => {
    const relPascal = GeneratorHelper.snakeToPascal(rel);
    output += `import { ${relPascal} } from '../../${rel}/entities/${rel}.entity';\n`;
  });
  
  output += '\n';

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 3: Class-level decorators (composite indexes)
  // ═══════════════════════════════════════════════════════════════════
  
  // Composite indexes (multi-column)
  const compositeIndexes = idxList.filter(idx => !idx.isPrimary && idx.columns.length > 1);
  if (compositeIndexes.length > 0) {
    output += `// Composite indexes\n`;
    compositeIndexes.forEach(idx => {
      const columns = idx.columns.map(c => `'${c}'`).join(', ');
      const opts: string[] = [];
      if (idx.isUnique) opts.push('unique: true');
      if (idx.type === 'FULLTEXT') opts.push('fulltext: true');
      if (idx.type === 'SPATIAL') opts.push('spatial: true');
      
      const optStr = opts.length > 0 ? `, { ${opts.join(', ')} }` : '';
      output += `@Index('${idx.name}', [${columns}]${optStr})\n`;
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 4: Entity class definition
  // ═══════════════════════════════════════════════════════════════════
  
  output += `@Entity('${tableName}')\n`;
  output += `export class ${entityName} extends Base {\n`;

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 5: Column definitions
  // ═══════════════════════════════════════════════════════════════════
  
  columns
    .filter(col => !skipColumns.has(col.name.toLowerCase()) && !fkColumns.has(col.name))
    .forEach(col => {
      const colType = GeneratorHelper.mapMysqlTypeToColumnType(col.type);
      const tsType = GeneratorHelper.mapMysqlTypeToTsType(col.type);
      const length = GeneratorHelper.extractLength(col.type);
      const isEnum = col.type.toLowerCase().includes('enum');
      const isJson = col.type.toLowerCase() === 'json';
      
      // Check for single-column index
      const singleIndex = idxList.find(
        i => !i.isPrimary && i.columns.length === 1 && i.columns[0] === col.name
      );
      
      // Add @Index decorator for non-unique single-column indexes
      if (singleIndex && !singleIndex.isUnique) {
        output += `  @Index('${singleIndex.name}')\n`;
      }
      
      // Build column options
      const opts: string[] = [];
      opts.push(`name: '${col.name}'`);
      
      // Type-specific options
      if (isEnum) {
        opts.push(`type: 'enum'`);
        opts.push(`enum: ${GeneratorHelper.snakeToPascal(col.name)}Enum`);
      } else if (isJson) {
        opts.push(`type: 'json'`);
      } else {
        opts.push(`type: '${colType}'`);
      }
      
      // Common options
      opts.push(`nullable: ${col.nullable}`);
      
      // Length for string types
      if (length && ['varchar', 'char', 'binary', 'varbinary'].includes(colType)) {
        opts.push(`length: ${length}`);
      }
      
      // Unique constraint from single-column unique index
      if (singleIndex?.isUnique) {
        opts.push(`unique: true`);
      }
      
      // Default value
      if (col.default !== null && col.default !== undefined) {
        const defaultVal = col.default === 'CURRENT_TIMESTAMP' 
          ? `() => 'CURRENT_TIMESTAMP'` 
          : typeof col.default === 'string' ? `'${col.default}'` : col.default;
        opts.push(`default: ${defaultVal}`);
      }
      
      // Transformers
      if (colType === 'bit') {
        opts.push(`transformer: new BoolBitTransformer()`);
      }
      if (colType === 'binary' && length === 16) {
        opts.push(`transformer: uuidV7ValueTransformer`);
      }
      
      output += `  @Column({ ${opts.join(', ')} })\n`;
      
      // Property declaration with proper TypeScript type
      const finalType = isEnum 
        ? `${GeneratorHelper.snakeToPascal(col.name)}Enum` 
        : tsType;
      const nullSuffix = col.nullable ? ' | null' : '';
      
      output += `  ${GeneratorHelper.snakeToCamelCase(col.name)}: ${finalType}${nullSuffix};\n\n`;
    });

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 6: ManyToOne & Owning OneToOne relationships
  // ═══════════════════════════════════════════════════════════════════
  
  if (relations.length > 0) {
    output += `  // ──────────────────────────────────────────────────────────────\n`;
    output += `  // Outgoing Relations (this entity owns the foreign key)\n`;
    output += `  // ──────────────────────────────────────────────────────────────\n\n`;
    
    relations.forEach(rel => {
      const relatedEntity = GeneratorHelper.snakeToPascal(rel.referencedTable);
      const propertyName = GeneratorHelper.snakeToCamelCase(rel.column.replace(/_id$/i, ''));
      const relationType = rel.isUnique ? 'OneToOne' : 'ManyToOne';
      
      // Relation options
      const relOpts: string[] = [];
      relOpts.push(`eager: false`);
      
      if (rel.nullable) {
        relOpts.push(`nullable: true`);
        // Only allowing SET NULL if the column is nullable
        relOpts.push(`onDelete: 'SET NULL'`);
      }
      
      output += `  @${relationType}(() => ${relatedEntity}, { ${relOpts.join(', ')} })\n`;
      output += `  @JoinColumn({ name: '${rel.column}', referencedColumnName: '${rel.referencedColumn}' })\n`;
      output += `  ${propertyName}: ${relatedEntity}${rel.nullable ? ' | null' : ''};\n\n`;
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 7: OneToMany & Inverse OneToOne relationships
  // ═══════════════════════════════════════════════════════════════════
  
  const validReferencedBy = referencedBy.filter(ref => !skipColumns.has(ref.column.toLowerCase()));
  
  if (validReferencedBy.length > 0) {
    output += `  // ──────────────────────────────────────────────────────────────\n`;
    output += `  // Incoming Relations (other entities reference this one)\n`;
    output += `  // ──────────────────────────────────────────────────────────────\n\n`;
    
    validReferencedBy.forEach(ref => {
      const relatedEntity = GeneratorHelper.snakeToPascal(ref.table);
      const relatedEntityVar = GeneratorHelper.snakeToCamelCase(ref.table);
      const inverseProperty = GeneratorHelper.snakeToCamelCase(ref.column.replace(/_id$/i, ''));
      
      if (ref.isUnique) {
        // Inverse OneToOne
        const propertyName = relatedEntityVar;
        output += `  @OneToOne(() => ${relatedEntity}, (${relatedEntityVar}) => ${relatedEntityVar}.${inverseProperty})\n`;
        output += `  ${propertyName}: ${relatedEntity};\n\n`;
      } else {
        // OneToMany
        const propertyName = `${ref.table}`;
        output += `  @OneToMany(() => ${relatedEntity}, (${relatedEntityVar}) => ${relatedEntityVar}.${inverseProperty})\n`;
        output += `  ${GeneratorHelper.snakeToCamelCase(propertyName)}: ${relatedEntity}[];\n\n`;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 8: ManyToMany relationships
  // ═══════════════════════════════════════════════════════════════════
  
  if (manyToMany.length > 0) {
    output += `  // ──────────────────────────────────────────────────────────────\n`;
    output += `  // Many-to-Many Relations\n`;
    output += `  // ──────────────────────────────────────────────────────────────\n\n`;
    
    manyToMany.forEach(rel => {
      const relatedEntity = GeneratorHelper.snakeToPascal(rel.targetEntity);
      const propertyName = GeneratorHelper.snakeToCamelCase(rel.targetEntity);
      
      output += `  @ManyToMany(() => ${relatedEntity})\n`;
      
      // JoinTable only on owning side
      if (rel.isOwningSide) {
        output += `  @JoinTable({\n`;
        output += `    name: '${rel.junctionTable}',\n`;
        output += `    joinColumn: { name: '${rel.joinColumn.name}', referencedColumnName: '${rel.joinColumn.referencedColumnName}' },\n`;
        output += `    inverseJoinColumn: { name: '${rel.inverseJoinColumn.name}', referencedColumnName: '${rel.inverseJoinColumn.referencedColumnName}' },\n`;
        output += `  })\n`;
      }
      
      output += `  ${propertyName}: ${relatedEntity}[];\n\n`;
    });
  }

  output += `}\n`;
  
  return output;
}
