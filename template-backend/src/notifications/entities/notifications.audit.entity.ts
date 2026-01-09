import { AuditingAction, AuditingEntityDefaultColumns } from 'typeorm-auditing';
import { AuditEntity } from '../../common/decorators/audit-entity.decorator';
import { Notifications } from './notifications.entity';

@AuditEntity(Notifications)
export class NotificationsAudit
  extends Notifications
  implements AuditingEntityDefaultColumns
{
  readonly _seq: number;
  readonly _action: AuditingAction;
  readonly _modifiedAt: Date;
}
