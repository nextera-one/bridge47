import type DataObject from './DataObject';

export interface FilterModel {
  // value: DataObject;
  value?: string | ((row: DataObject) => string);
  label: string;
  dataType: DataType;
  options?: Array<Option | DataObject> | undefined | null;
  optionsMultiple?: boolean;
  api?: Api;
}

export interface Api extends DataObject {
  endPoint: string;
  loading: boolean;
  option: Option;
}

export interface Option extends DataObject {
  label: string;
  value: string;
}

export enum DataType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  ENUM = 'ENUM',
  SELECT = 'SELECT',
  SELECT_API = 'SELECT_API',
}
