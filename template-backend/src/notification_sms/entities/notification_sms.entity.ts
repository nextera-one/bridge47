import { BoolBitTransformer } from "src/transformer/bool_bit.transformer";
import {
  Column,
  Entity,
  Index
} from "typeorm";
import { Base } from "../../base/base.entity";
import DataObject from "../../model/data_object";

// Indexes discovered at generation time
@Index("fk_notification_sms_1_idx", ["log"])
@Index("idx_notification_sms_created_by", ["created_by"])
@Index("idx_notification_sms_updated_by", ["updated_by"])
@Entity("notification_sms")
export class NotificationSms extends Base {
  @Column({ type: "varchar", name: "subject", nullable: false, length: 500 })
  subject: string;

  @Column({ type: "longtext", name: "message", nullable: false })
  message: string;

  @Column({ type: "varchar", name: "color", nullable: false, length: 25 })
  color: string;

  @Column({ type: "varchar", name: "ref", nullable: false, length: 255 })
  ref: string;

  @Column({ type: "varchar", name: "to", nullable: true, length: 255 })
  to: string | null;

  @Column({ type: "int", name: "sent", nullable: false, transformer: new BoolBitTransformer() })
  sent: boolean;

  @Column({ type: "longtext", name: "error", nullable: true })
  error: string | null;

  @Column({ type: "varchar", name: "to_direct", nullable: true, length: 255 })
  to_direct: string | null;

  @Column({ type: "json", name: "response", nullable: true })
  response: DataObject | null;

  @Column({ type: "json", name: "settings", nullable: true })
  settings: DataObject | null;

  @Column({ type: "int", name: "expiration_time", nullable: true })
  expiration_time: number | null;

  @Column({ type: "varchar", name: "token", nullable: false, length: 500 })
  token: string;


}
