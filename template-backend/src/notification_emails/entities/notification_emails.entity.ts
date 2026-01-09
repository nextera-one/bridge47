import {
  Column,
  Entity,
  Index
} from "typeorm";
import { Base } from "../../base/base.entity";
import DataObject from "../../model/data_object";
import { TinyIntBooleanTransformer } from "src/transformer/tinyint-boolean.transformer";
import { TimestampToDateTransformer } from "src/transformer/timestamp_to_date.transformer";

// Indexes discovered at generation time
@Index("fk_notification_emails_1_idx", ["log"])
@Index("idx_notification_emails_created_by", ["created_by"])
@Index("idx_notification_emails_updated_by", ["updated_by"])
@Entity("notification_emails")
export class NotificationEmails extends Base {
  @Column({ type: "varchar", name: "subject", nullable: false, length: 500 })
  subject: string;

  @Column({ type: "longtext", name: "message", nullable: false })
  message: string;

  @Column({ type: "varchar", name: "color", nullable: false, length: 25 })
  color: string;

  @Column({ type: "varchar", name: "ref", nullable: true, length: 255 })
  ref: string | null;

  @Column({ type: "varchar", name: "ref_type", nullable: true, length: 255 })
  ref_type: string | null;

  @Column({ type: "text", name: "from_address", nullable: true })
  from_address: string | null;

  @Column({ type: "text", name: "bcc", nullable: true })
  bcc: string | null;

  @Column({ type: "text", name: "cc", nullable: true })
  cc: string | null;

  @Column({ type: "varchar", name: "to", nullable: true, length: 255 })
  to: string | null;

  @Column({ type: "int", name: "in_process", nullable: false })
  in_process: number;

  @Column({ type: "int", name: "sent", nullable: false,
    transformer: new TinyIntBooleanTransformer(),


   })
  sent: boolean;

  @Column({ type: "longtext", name: "error", nullable: true })
  error: string | null;

  @Column({ type: "json", name: "settings", nullable: true })
  settings: DataObject | null;

  @Column({ type: "varchar", name: "to_direct", nullable: true, length: 255 })
  to_direct: string | null;

  @Column({ type: "varchar", name: "attachment", nullable: true, length: 255 })
  attachment: string | null;

  @Column({ type: "int", name: "expiration_time", nullable: true,     transformer: TimestampToDateTransformer,
 })
  expiration_time: number | null;

  @Column({ type: "json", name: "attachments", nullable: true })
  attachments: DataObject | null;

  @Column({ type: "varchar", name: "token", nullable: false, length: 500 })
  token: string;

}
