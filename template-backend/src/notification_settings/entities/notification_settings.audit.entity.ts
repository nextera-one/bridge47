import { AuditingAction, AuditingEntityDefaultColumns } from 'typeorm-auditing';
import { AuditEntity } from '../../common/decorators/audit-entity.decorator';
import { NotificationSettings } from './notification_settings.entity';

@AuditEntity(NotificationSettings)
export class NotificationSettingsAudit
  extends NotificationSettings
  implements AuditingEntityDefaultColumns
{
  readonly _seq: number;
  readonly _action: AuditingAction;
  readonly _modifiedAt: Date;
}
