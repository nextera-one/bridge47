import { Base } from 'src/base/base.entity';
import DataObject from '../../model/data_object';
//TODO: any to be removed
export default interface Filter<T extends Base | any = any> {
  page?: number;
  limit?: number;
  order_by?: OrderBy<T>;
  order?: string;
  group_by?: string;
  select?: string[];
  where?: Where<T>[];
  relations?: string[];
  extra?: DataObject;
  one?: boolean;
  ignorePaginationCount?: boolean;
  count?: boolean;
}

export interface Where<T> {
  by: keyof T | string;
  operator: string;
  value: string | number | boolean | Date | null | Array<string | number> | any;
  or?: Where<T>[];
}

export interface OrderBy<T> {
  by: keyof T | string;
  order: 'ASC' | 'DESC';
}
