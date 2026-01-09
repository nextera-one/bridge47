import { Type } from '@nestjs/common';
import { AuditingEntity } from 'typeorm-auditing';
// src/shared/decorators/audit-entity.decorator.ts
import { ConfigService } from '@nestjs/config';

export function AuditEntity<T>(entity: Type<T>): ClassDecorator {
  // bootstrap a temporary ConfigService just to pull in env vars
  // (this reads process.env, so make sure you've loaded your .env before runtime)
  const cs = new ConfigService();
  const schema = cs.get<string>('DATABASE_SCHEMA_AUDIT');

  return (target: Function) => {
    // delegate to the real decorator
    AuditingEntity(entity, {
      database: schema,
      schema: schema,
    })(target as any);
  };
}
