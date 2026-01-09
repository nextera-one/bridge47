import { AuditingAction, AuditingEntityDefaultColumns } from 'typeorm-auditing';
import { AuditEntity } from '../../common/decorators/audit-entity.decorator';
import { NotificationEmails } from './notification_emails.entity';

@AuditEntity(NotificationEmails)
export class NotificationEmailsAudit
  extends NotificationEmails
  implements AuditingEntityDefaultColumns
{
  readonly _seq: number;
  readonly _action: AuditingAction;
  readonly _modifiedAt: Date;
}
