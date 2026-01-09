import { ValueTransformer } from 'typeorm';

/**
 * Transforms between JavaScript Date objects and BIGINT timestamps in milliseconds.
 */
export const TimestampToDateTransformer: ValueTransformer = {
  to: (value: Date | number): number | null =>
    value instanceof Date ? value.getTime() : (value ?? null),

  from: (value: string | number | null): Date | null =>
    value !== null ? new Date(Number(value)) : null,
};
