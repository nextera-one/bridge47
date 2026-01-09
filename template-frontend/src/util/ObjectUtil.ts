import type DataObject from '../models/DataObject';
import type { FormItem } from '../models/FormItem';

export type UndefinedObject<T extends Record<string, unknown>> = {
  [K in keyof T]: undefined;
};

export default class ObjectUtil {
  public static appendArrayOrReplaceById(arr: Array<DataObject>, data: Array<DataObject>) {
    if (data) data.forEach((item) => ObjectUtil.appendOrReplaceById(arr, item));
  }
  public static appendOrReplaceById(arr: Array<DataObject>, obj: DataObject) {
    const index = arr.findIndex((x) => x.id === obj.id);
    if (index === -1) {
      arr.push(obj);
    } else {
      arr[index] = obj;
    }
  }

  public static removeById(arr: Array<DataObject>, id: string) {
    const index = arr.findIndex((x) => x.id === id);
    if (index !== -1) {
      arr.splice(index, 1);
    }
  }

  public static fillObjectBasedonTargetKeys(source: DataObject, target: DataObject) {
    if (!target) return;
    const targetKeys: string[] = Object.keys(target);
    for (const key of targetKeys) {
      target[key] = source[key];
    }
  }

  public static fillObject(source: DataObject, target: DataObject, clearSource = true) {
    if (source && target) {
      if (clearSource) {
        Object.keys(source).forEach((key) => {
          delete source[key];
        });
      }
      Object.keys(source).forEach((key) => {
        target[key] = source[key];
      });
    }
  }

  //cloneObject
  public static cloneObject(obj: unknown) {
    return JSON.parse(JSON.stringify(obj)); // Todo: use structuredClone for deep clone
  }

  public static clearObjectValues<T extends Record<string, unknown>>(obj: T): UndefinedObject<T> {
    const keys = Object.keys(obj) as (keyof T)[];
    const result: Partial<UndefinedObject<T>> = {};

    for (const key of keys) {
      result[key] = undefined;
    }

    return result as UndefinedObject<T>;
  }

  // is Reactive Object Empty
  public static isReactiveObjectEmpty = (obj: DataObject) => {
    return Object.keys(obj).length === 0;
  };

  public static fillDefaultValues = (arr: FormItem[], data: DataObject) => {
    arr.forEach((item) => {
      const key = item.field;
      // only set a default if not already provided
      if (data[key] === undefined || data[key] === null) {
        let def: string | number | boolean | Array<string | number | boolean> = '';
        switch (item.fieldType) {
          case 'number':
            def = 0;
            break;
          case 'boolean':
            def = false;
            break;
          case 'Array':
            def =
              item.options && item.options.length && item.options[0]?.value !== undefined
                ? (item.options[0].value as string | number | boolean)
                : '';
            break;
          default: // 'string'
            def = '';
        }
        data[key] = def;
      }
    });
  };

  public static toError = (error: unknown): Error => {
    return error instanceof Error ? error : new Error(String(error));
  };
}
