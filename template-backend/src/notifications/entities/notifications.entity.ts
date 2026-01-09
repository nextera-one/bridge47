import {
  Column,
  Entity,
  Index
} from "typeorm";
import { Base } from "../../base/base.entity";
import DataObject from "../../model/data_object";

// Indexes discovered at generation time
@Index("idx_notifications_created_by", ["created_by"])
@Index("idx_notifications_updated_by", ["updated_by"])
@Entity("notifications")
export class Notifications extends Base {
  @Column({ type: "varchar", name: "title", nullable: false, length: 500 })
  title: string;

  @Column({ type: "text", name: "description", nullable: false })
  description: string;

  @Column({ type: "int", name: "active", nullable: false })
  active: number;

  @Column({ type: "varchar", name: "color", nullable: false, length: 25 })
  color: string;

  @Column({ type: "varchar", name: "ref", nullable: false, length: 255 })
  ref: string;

  @Column({ type: "varchar", name: "ref_type", nullable: true, length: 255 })
  ref_type: string | null;

  @Column({ type: "varchar", name: "to", nullable: true, length: 255 })
  to: string | null;

  @Column({ type: "int", name: "seen", nullable: false })
  seen: number;

  @Column({ type: "varchar", name: "action", nullable: true, length: 255 })
  action: string | null;

  @Column({ type: "json", name: "message", nullable: true })
  message: DataObject | null;

  @Column({ type: "varchar", name: "to_data", nullable: false, length: 255 })
  to_data: string;

  @Column({ type: "int", name: "firebase", nullable: false })
  firebase: number;

}
