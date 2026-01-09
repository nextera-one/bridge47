import { AuditingAction, AuditingEntityDefaultColumns } from 'typeorm-auditing';
import { AuditEntity } from '../../common/decorators/audit-entity.decorator';
import { Auth } from './auth.entity';

@AuditEntity(Auth)
export class AuthAudit extends Auth implements AuditingEntityDefaultColumns {
  readonly _seq: number;
  readonly _action: AuditingAction;
  readonly _modifiedAt: Date;
}
