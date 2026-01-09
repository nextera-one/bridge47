import { AuditingAction, AuditingEntityDefaultColumns } from 'typeorm-auditing';
import { AuditEntity } from '../../common/decorators/audit-entity.decorator';
import { Errors } from './errors.entity';

@AuditEntity(Errors)
export class ErrorsAudit
  extends Errors
  implements AuditingEntityDefaultColumns
{
  readonly _seq: number;
  readonly _action: AuditingAction;
  readonly _modifiedAt: Date;
}
