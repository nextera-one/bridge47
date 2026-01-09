import { ClassTransformOptions, plainToInstance } from 'class-transformer';

import { BaseDto } from '../../base/base.dto';
import { ReadBaseDto } from '../../base/read-base.dto';
import CurrentUserModel from '../../model/current_user.model';
import DataObject from '../../model/data_object';

type KeyStructure = {
  [key: string]: string[] | KeyStructure;
};

export default class DtoUtil {
  public static convertToDto(
    entity: any,
    dtos: any,
    options?: ClassTransformOptions,
  ): any {
    const effectiveOptions: ClassTransformOptions = {
      //excludeExtraneousValues: true,
      enableImplicitConversion: false,
      ...options,
    };
    if (!dtos) {
      return null;
    }
    const arr = Array.isArray(dtos)
      ? dtos
      : dtos.data && Array.isArray(dtos.data)
        ? dtos.data
        : null;
    if (arr) {
      const convertedEntities = [];
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const converted = plainToInstance(entity, item, effectiveOptions);
        convertedEntities.push(converted);
      }
      return convertedEntities;
    } else {
      const result = plainToInstance(entity, dtos, effectiveOptions);
      return result;
    }
  }

  public static convertToEntity(
    entity: any,
    dtos: any,
    options?: ClassTransformOptions,
  ): any {
    try {
      if (!options) {
        options = {
          // excludeExtraneousValues: true,
          enableImplicitConversion: true,
        };
      } else {
        // options.excludeExtraneousValues = true;
        options.enableImplicitConversion = true;
      }
      return plainToInstance(entity, dtos, options);
    } catch (error) {
      return null;
    }
  }

  public static booleanToBuffer(value: any): undefined | Buffer {
    if (typeof value !== 'boolean') {
      return undefined;
    }
    // Create a new buffer with a single byte
    const buffer = Buffer.alloc(1);
    // Set the buffer value based on the boolean value
    buffer.writeUInt8(value ? 1 : 0, 0);
    return buffer;
  }

  public static bufferToBoolean(
    value: Buffer | boolean | number | string,
  ): undefined | boolean {
    if (!value) {
      return false;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'number') {
      return value === 1;
    }
    if (typeof value === 'string') {
      return (
        value.trim().toLowerCase() === 'true' ||
        value.trim().toLowerCase() === '1'
      );
    }
    // Return true if the buffer value is 1
    return value.readUInt8(0) === 1;
  }

  public static overrideAuditColumns<T extends BaseDto>(
    dto: T | T[],
    currentUser: CurrentUserModel,
    update = false,
  ): T | T[] {
    if (!currentUser) return dto;

    const now = new Date();
    // const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

    const processOne = (obj: T): T => {
      if (!update) {
        obj.created_at = now;
        obj.created_by =
          currentUser?.id || 'c55a3092-52bf-11f0-bad2-0eec16def877';
      } else {
        delete obj.created_at;
        delete obj.created_by;
      }
      obj.updated_at = now;
      obj.updated_by =
        currentUser?.id || 'c55a3092-52bf-11f0-bad2-0eec16def877';
      return obj;
    };

    return Array.isArray(dto) ? dto.map(processOne) : processOne(dto);
  }

  public static filterObject<T extends ReadBaseDto>(
    obj: T,
    keys: string[] | KeyStructure,
  ): Partial<T> {
    if (Array.isArray(keys)) {
      // If keys is an array, filter obj based on these keys
      return keys.reduce((acc, key) => {
        if (key in obj) {
          acc[key as keyof T] = obj[key as keyof T];
        }
        return acc;
      }, {} as Partial<T>);
    } else {
      // If keys is an object, we need to handle nested objects
      return Object.keys(keys).reduce((acc, key) => {
        if (
          key in obj &&
          typeof obj[key as keyof T] === 'object' &&
          obj[key as keyof T] !== null &&
          !Array.isArray(obj[key as keyof T])
        ) {
          (acc as DataObject)[key] = DtoUtil.filterObject(
            obj[key as keyof T] as any,
            keys[key] as KeyStructure,
          );
        }
        return acc;
      }, {} as Partial<T>);
    }
  }

  public static cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
    const result: any = {};

    for (const [key, value] of Object.entries(obj)) {
      if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        continue; // skip
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleaned = DtoUtil.cleanObject(value);
        if (Object.keys(cleaned).length > 0) {
          result[key] = cleaned;
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  }
}
