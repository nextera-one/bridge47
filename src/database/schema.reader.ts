import * as mysql from 'mysql2/promise';

import { config } from '../generator.config';

// #region Interface Definitions
// (No changes to ColumnSchema and IndexSchema)
export interface ColumnSchema {
  name: string;
  type: string;
  default: string | null;
  key: string;
  nullable: boolean;
}

export interface IndexSchema {
  name: string;
  columns: string[];
  isPrimary: boolean;
  isUnique: boolean;
  type?: 'BTREE' | 'FULLTEXT' | 'SPATIAL';
}
export type IndexType = 'BTREE' | 'FULLTEXT' | 'SPATIAL';

// ENHANCED: Added 'isUnique' to distinguish ManyToOne from OneToOne.
export interface RelationSchema {
  table: string;
  column: string;
  referencedTable: string;
  referencedColumn: string;
  isUnique: boolean;
  nullable?: boolean;
}

// ENHANCED: Added 'isUnique' for the inverse side of a OneToOne.
export interface ReferencedBySchema {
  table: string; // The table that references this one
  column: string; // The property on the other entity (inferred from FK name)
  referencingColumn: string; // The actual FK column on the other table
  isUnique: boolean;
}

// NEW: Schema for Many-to-Many relationships.
export interface ManyToManySchema {
  targetEntity: string;
  junctionTable: string;
  joinColumn: { name: string; referencedColumnName: string };
  inverseJoinColumn: { name: string; referencedColumnName: string };
  isOwningSide: boolean;
}

// ENHANCED: Full schema now includes ManyToMany relations.
export interface FullTableSchema {
  columns: ColumnSchema[];
  relations: RelationSchema[];
  referencedBy: ReferencedBySchema[];
  indexes: IndexSchema[];
  manyToMany: ManyToManySchema[];
}
// #endregion

export class SchemaReader {
  private pool!: mysql.Pool;

  // Caches for schema-wide data to avoid redundant queries
  private _tableColumnsCache: Map<string, ColumnSchema[]> | null = null;
  private _tableRelationsCache: Map<string, any[]> | null = null;
  private _uniqueKeyCache: Set<string> | null = null;

  public async connect(): Promise<void> {
    this.pool = mysql.createPool(config.db);
    console.log("Database connection established.");
  }

  /**
   * Fetches the complete schema for a given table, including all relationship types.
   */
  public async getTableSchema(tableName: string): Promise<FullTableSchema> {
    // Pre-load all schema data on first run for efficiency
    await this._initializeCaches();

    const columns = this._tableColumnsCache!.get(tableName) || [];
    const indexes = await this._getIndexes(tableName);

    // Add 'isUnique' flag to outgoing relations
    const relations: RelationSchema[] = (this._tableRelationsCache!.get(tableName) || []).map((rel) => ({
      table: rel.table_name,
      column: rel.column_name,
      referencedTable: rel.ref_table,
      referencedColumn: rel.ref_column,
      isUnique: this._uniqueKeyCache!.has(`${rel.table_name}.${rel.column_name}`),
    }));

    // Find incoming relations (tables that reference this one)
    const referencedBy: ReferencedBySchema[] = [];
    for (const [otherTable, rels] of this._tableRelationsCache!.entries()) {
      for (const rel of rels) {
        if (rel.ref_table === tableName) {
          const propertyNameOnOtherTable = rel.column_name.replace(/_id$/, '');
          referencedBy.push({
            table: otherTable,
            column: propertyNameOnOtherTable,
            referencingColumn: rel.column_name,
            isUnique: this._uniqueKeyCache!.has(`${otherTable}.${rel.column_name}`),
          });
        }
      }
    }

    // Detect many-to-many relationships via junction tables
    const manyToMany = this._findManyToManyRelations(tableName);

    return { columns, relations, referencedBy, indexes, manyToMany };
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      console.log("Database connection closed.");
    }
  }

  // #region Private Helper Methods

  /**
   * Initializes schema-wide caches on the first call.
   */
  private async _initializeCaches(): Promise<void> {
    if (this._tableColumnsCache !== null) return; // Already initialized

    console.log("Initializing schema caches...");
    
    // 1. Cache all columns
    this._tableColumnsCache = new Map();
    const [cols] = await this.pool.query<any[]>(
      `SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT
       FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE()`
    );
    for (const r of cols) {
      if (!this._tableColumnsCache.has(r.TABLE_NAME)) this._tableColumnsCache.set(r.TABLE_NAME, []);
      this._tableColumnsCache.get(r.TABLE_NAME)!.push({
        name: r.COLUMN_NAME,
        type: r.COLUMN_TYPE,
        nullable: r.IS_NULLABLE === 'YES',
        key: r.COLUMN_KEY || '',
        default: r.COLUMN_DEFAULT ?? null,
      });
    }

    // 2. Cache all foreign key relations
    this._tableRelationsCache = new Map();
    const [rels] = await this.pool.query<any[]>(
      `SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL`
    );
    for (const r of rels) {
      if (!this._tableRelationsCache.has(r.TABLE_NAME)) this._tableRelationsCache.set(r.TABLE_NAME, []);
      this._tableRelationsCache.get(r.TABLE_NAME)!.push({
        table_name: r.TABLE_NAME,
        column_name: r.COLUMN_NAME,
        ref_table: r.REFERENCED_TABLE_NAME,
        ref_column: r.REFERENCED_COLUMN_NAME,
      });
    }

    // 3. Cache all unique keys for fast lookups
    this._uniqueKeyCache = new Set();
    const [keys] = await this.pool.query<any[]>(
      `SELECT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.STATISTICS
       WHERE TABLE_SCHEMA = DATABASE() AND NON_UNIQUE = 0`
    );
    for (const k of keys) {
      this._uniqueKeyCache.add(`${k.TABLE_NAME}.${k.COLUMN_NAME}`);
    }
    console.log("Schema caches initialized.");
  }
  
  /**
   * Finds many-to-many relationships for a given table by identifying junction tables.
   */
  private _findManyToManyRelations(tableName: string): ManyToManySchema[] {
    const manyToManyRelations: ManyToManySchema[] = [];

    for (const [junctionTableName, relations] of this._tableRelationsCache!.entries()) {
      const columns = this._tableColumnsCache!.get(junctionTableName) || [];
      
      // Heuristic for identifying a junction table:
      // 1. Has exactly two foreign keys.
      // 2. Has only 2 or 3 columns (e.g., fk1, fk2, and optional id/timestamp).
      const isJunctionTable = relations.length === 2 && columns.length <= 3;
      if (!isJunctionTable) continue;

      const [rel1, rel2] = relations;
      
      // Check if one of the FKs points to our current table
      if (rel1.ref_table === tableName || rel2.ref_table === tableName) {
        const [owningRel, inverseRel] = rel1.ref_table === tableName ? [rel1, rel2] : [rel2, rel1];

        manyToManyRelations.push({
          targetEntity: inverseRel.ref_table,
          junctionTable: junctionTableName,
          joinColumn: { name: owningRel.column_name, referencedColumnName: owningRel.ref_column },
          inverseJoinColumn: { name: inverseRel.column_name, referencedColumnName: inverseRel.ref_column },
          // Deterministic way to assign owning side (lexicographical check)
          // If self-referencing, use column names to distinguish
          isOwningSide: tableName === inverseRel.ref_table 
            ? owningRel.column_name < inverseRel.column_name 
            : tableName < inverseRel.ref_table,
        });
      }
    }
    return manyToManyRelations;
  }
  
  /**
   * Fetches detailed index information for a specific table.
   */
  private async _getIndexes(tableName: string): Promise<IndexSchema[]> {
    const [idxRows] = await this.pool.query<any[]>(
      `SELECT INDEX_NAME as name, COLUMN_NAME as column_name, NON_UNIQUE as non_unique, INDEX_TYPE as index_type
       FROM INFORMATION_SCHEMA.STATISTICS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
       ORDER BY name, SEQ_IN_INDEX`,
      [tableName]
    );

    const indexMap = new Map<string, { cols: string[]; nonUnique: number; type: string }>();
    for (const r of idxRows) {
      if (!indexMap.has(r.name)) indexMap.set(r.name, { cols: [], nonUnique: r.non_unique, type: r.index_type });
      indexMap.get(r.name)!.cols.push(r.column_name);
    }
    
    return Array.from(indexMap.entries()).map(([name, v]) => ({
      name,
      columns: v.cols,
      isPrimary: name === 'PRIMARY',
      isUnique: v.nonUnique === 0,
      type: ['BTREE', 'FULLTEXT', 'SPATIAL'].includes(v.type) ? v.type as IndexType : undefined,
    }));
  }

  // #endregion
}