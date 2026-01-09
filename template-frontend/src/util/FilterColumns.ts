import { DataType, type FilterModel } from '../models/FilterModel';
import type DataObject from '../models/DataObject';

export default class FilterColumns {
  public static USERS_COLUMNS: Array<FilterModel> = [
    {
      value: (row: DataObject) => `${row.first_name as string} ${row.last_name as string}`,
      label: 'name',
      dataType: DataType.STRING,
    },
    {
      value: 'email',
      label: 'email',
      dataType: DataType.STRING,
    },
    {
      label: 'mobile',
      value: 'mobile',
      dataType: DataType.NUMBER,
    },
    {
      value: 'role',
      label: 'role',
      dataType: DataType.STRING,
    },
    {
      value: 'active',
      label: 'status',
      dataType: DataType.BOOLEAN,
    },
    {
      label: 'created_at',
      value: 'created_at',
      dataType: DataType.DATE,
    },
  ];
}
