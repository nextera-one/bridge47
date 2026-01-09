import type { JSONValue } from './DataObject';
import type DataObject from './DataObject';

export interface FormItem extends DataObject {
  field: string;
  label: string;
  fieldType: string | number | boolean | Array<JSONValue> | object;
  type?:
    | 'text'
    | 'password'
    | 'textarea'
    | 'email'
    | 'search'
    | 'tel'
    | 'file'
    | 'number'
    | 'url'
    | 'time'
    | 'date'
    | 'datetime-local'
    | undefined;
  required: boolean;
  options?: Array<{ label: string; value: string | number | boolean | Record<string, unknown> }>;
}
