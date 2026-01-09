import { AuditingAction, AuditingEntityDefaultColumns } from 'typeorm-auditing';
import { AuditEntity } from '../../common/decorators/audit-entity.decorator';
import { ErrorCodes } from './error_codes.entity';

@AuditEntity(ErrorCodes)
export class ErrorCodesAudit
  extends ErrorCodes
  implements AuditingEntityDefaultColumns
{
  readonly _seq: number;
  readonly _action: AuditingAction;
  readonly _modifiedAt: Date;
}
