import { AuditingAction, AuditingEntityDefaultColumns } from 'typeorm-auditing';
import { AuditEntity } from '../../common/decorators/audit-entity.decorator';
import { ErrorTranslations } from './error_translations.entity';

@AuditEntity(ErrorTranslations)
export class ErrorTranslationsAudit
  extends ErrorTranslations
  implements AuditingEntityDefaultColumns
{
  readonly _seq: number;
  readonly _action: AuditingAction;
  readonly _modifiedAt: Date;
}
