// This file generates the content for frontend base files.

/**
 * Generates the string content for base frontend model and function interface files.
 * These interfaces provide the foundational data structures for API interactions.
 * @returns {{ baseModel: string; baseFunc: string }} An object containing the string content for the base model and base function interfaces.
 */
export function generateBase(): { baseModel: string; baseFunc: string } {
  const model = `
import type DataObject from 'src/models/DataObject';

/**
 * Defines the common properties shared across all data models.
 */
export interface BaseModel extends DataObject {
  /** The unique identifier (usually a UUID). */
  id?: string;
  /** Timestamp of when the record was created. */
  created_at?: Date;
  /** Timestamp of the last update to the record. */
  updated_at?: Date;
  /** ID of the user who created the record. */
  created_by?: string;
  /** ID of the user who last updated the record. */
  updated_by?: string;
  /** Identifier for a related partner or tenant. */
  partner?: string;
  /** Additional unstructured data related to the partner. */
  partner_data?: DataObject;
  /** A log message or identifier. */
  log?: string;
  /** Additional unstructured data for logging purposes. */
  log_data?: DataObject;
}
`;

  const func = `
import type DataObject from 'src/models/DataObject';
import type { BaseModel } from './Base.model';

/**
 * Defines the structure for filtering, sorting, and paginating API queries.
 */
export interface Filter extends DataObject {
  /** The page number for pagination. */
  page?: number;
  /** The number of items per page. */
  limit?: number;
  /** The sorting criteria. Can be a single object or an array for multi-level sorting. */
  order_by?: OrderBy | OrderBy[];
  /** The field to group the results by. */
  group_by?: string;
  /** The specific fields to be returned in the result. */
  select?: string[];
  /** An array of conditions for the 'where' clause. */
  where?: Where[];
  /** The relations to be included (e.g., for joining tables). */
  relations?: string[];
  /** Extra, non-standard parameters for the query. */
  extra?: DataObject;
  /** If true, the total count for pagination is not calculated, which can improve performance. */
  ignorePaginationCount?: boolean;
  /** If true, the query should only return the total count of matching records. */
  count?: boolean;
}

/**
 * Defines a single condition for a 'where' clause in a query.
 */
export interface Where extends DataObject {
  /** The field to apply the condition on. */
  by: string;
  /** The operator to use (e.g., 'equals', 'like', 'in'). */
  operator: string;
  /** The value to compare against. */
  value: string[] | string | number | boolean | Date | null;
  /** An array of 'Where' conditions to be joined with an OR operator. */
  or?: Where[];
}

/**
 * Defines a sorting condition (field and direction).
 */
export interface OrderBy extends DataObject {
  /** The field to sort by. */
  by: string;
  /** The sort order. */
  order: 'ASC' | 'DESC';
}

/**
 * Represents the structure of a paginated API response.
 * @template T The type of the data items.
 */
export interface PageResult<T> {
  /** An array of data items for the current page. */
  data: T[];
  /** The total number of items matching the query. */
  count: number;
}

/**
 * Encapsulates all properties needed for making a data request,
 * often used by UI components like data tables.
 * @template T The type of the data being requested.
 */
export interface RequestProps<T> {
  /** Pagination state. */
  pagination: Pagination;
  /** Filter criteria for the query. */
  filter?: Filter;
  /** The data payload, used for create or update operations. */
  data?: T;
  /** A function to get a specific cell value from a row, often used in dynamic tables. */
  getCellValue?: (col: DataObject, row: DataObject) => unknown;
}

/**
 * Defines the state of pagination, typically for a UI component.
 */
export interface Pagination {
  /** The field the data is currently sorted by. */
  sortBy: string;
  /** Whether the sort order is descending. */
  descending: boolean;
  /** The current page number. */
  page: number;
  /** The number of rows to display per page. */
  rowsPerPage: number;
  /** The total number of rows available. */
  rowsNumber?: number;
}

/**
 * Defines the basic structure for an API helper class, outlining standard CRUD operations.
 * @template T The type of the data being sent (e.g., a model or an ID string).
 * @template R The expected return type (e.g., a model, a boolean, or a paginated result).
 */
export interface BaseFunc<
  T extends BaseModel | string,
  R extends BaseModel | boolean | PageResult<BaseModel>,
> {
  /** A function to save (create or update) a record. */
  executeSave?(data?: T): Promise<R>;
  /** A function to get a list of records. */
  executeGet?(req?: RequestProps<T>): Promise<PageResult<R>>;
  /** A generic execution function for custom operations. */
  execute?(req?: RequestProps<T>): Promise<DataObject>;
  /** A function to delete a record. */
  executeDelete?(data?: T): Promise<boolean>;
}
`;

  return { baseModel: model, baseFunc: func };
}

/**
 * Generates the backend TypeORM Base entity class.
 * This class provides standard columns like ID, timestamps, and user tracking
 * that are inherited by all other entities.
 * @returns {string} The complete TypeScript code for the Base entity.
 */
export function generateBackendBaseEntity(): string {
  return `
import { 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  BaseEntity 
} from 'typeorm';
import DataObject from '../model/data_object';

export abstract class Base extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ name: 'created_by', nullable: true, length: 36 })
  created_by: string | null;

  @Column({ name: 'updated_by', nullable: true, length: 36 })
  updated_by: string | null;

  @Column({ name: 'partner', nullable: true, length: 36 })
  partner: string | null;

  @Column({ type: 'json', name: 'partner_data', nullable: true })
  partner_data: DataObject | null;

  @Column({ name: 'log', nullable: true, type: 'text' })
  log: string | null;

  @Column({ type: 'json', name: 'log_data', nullable: true })
  log_data: DataObject | null;
}
`;
}