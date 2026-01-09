import type DataObject from "src/models/DataObject";
import type { BaseModel } from "./Base.model";

export interface Filter extends DataObject {
  page?: number;
  limit?: number;
  order_by?: OrderBy | OrderBy[];
  group_by?: string;
  select?: string[];
  where?: Where[];
  relations?: string[];
  extra?: DataObject;
  ignorePaginationCount?: boolean;
  count?: boolean;
}

export interface Where extends DataObject {
  by: string;
  operator: string;
  value: string[] | string | number | boolean | Date | null;
  or?: Where[];
}

export interface OrderBy extends DataObject {
  by: string;
  order: "ASC" | "DESC";
}

export interface PageResult<T> {
  data: T[];
  count: number;
}

export interface RequestProps<T> {
  pagination: Pagination;
  filter?: Filter;
  data?: T;
  getCellValue?: (col: DataObject, row: DataObject) => unknown;
}

export interface Pagination {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}

export interface BaseFunc<
  T extends BaseModel | string,
  R extends BaseModel | boolean | PageResult<BaseModel>,
> {
  executeSave?(data?: T): Promise<R>;
  executeGet?(req?: RequestProps<T>): Promise<PageResult<R>>;
  execute?(req?: RequestProps<T>): Promise<DataObject>;
  executeDelete?(data?: T): Promise<boolean>;
}
