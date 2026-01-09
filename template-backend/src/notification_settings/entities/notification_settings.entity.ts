import {
  Column,
  Entity,
  Index
} from "typeorm";
import { Base } from "../../base/base.entity";
import DataObject from "../../model/data_object";

// Indexes discovered at generation time
@Index("idx_notification_settings_created_by", ["created_by"])
@Index("idx_notification_settings_updated_by", ["updated_by"])
@Entity("notification_settings")
export class NotificationSettings extends Base {
  @Column({ type: "int", name: "active", nullable: false })
  active: number;

  @Column({ type: "varchar", name: "color", nullable: false, length: 25 })
  color: string;

  @Column({ type: "timestamp", name: "type", nullable: false })
  type: Date;

  @Column({ type: "json", name: "settings", nullable: true })
  settings: DataObject | null;

}
