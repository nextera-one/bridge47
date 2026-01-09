import { AuditingAction, AuditingEntityDefaultColumns } from "typeorm-auditing";
import { AuditEntity } from "../../common/decorators/audit-entity.decorator";
import { Files } from "./files.entity";

/**
 * Audit entity for tracking changes to the Files entity.
 * Each instance of this class represents a single change (INSERT, UPDATE, or DELETE)
 * to a Files record.
 */
@AuditEntity(Files)
export class FilesAudit extends Files implements AuditingEntityDefaultColumns {
  /**
   * A sequence number for tracking the order of modifications, managed by the auditing library.
   * @readonly
   */
  readonly _seq: number;

  /**
   * The type of action that was performed (e.g., 'INSERT', 'UPDATE', 'DELETE').
   * @readonly
   */
  readonly _action: AuditingAction;

  /**
   * The timestamp indicating when the modification occurred.
   * @readonly
   */
  readonly _modifiedAt: Date;
}
