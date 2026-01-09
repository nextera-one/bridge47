import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  OneToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Index,
} from "typeorm";
import DataObject from "../../model/data_object";
import { Base } from "../../base/base.entity";
import { LevelEnum } from "../enums/level.enum";
@Index("idx_logs_source_level", ["source", "level"])
@Entity("logs")
export class Logs extends Base {
  @Column({ type: "enum", name: "level", nullable: false, enum: LevelEnum })
  level: LevelEnum;

  @Column({ type: "varchar", name: "source", nullable: false, length: 128 })
  source: string;

  @Column({ type: "varchar", name: "context", nullable: true, length: 255 })
  context: string | null;

  @Column({ type: "text", name: "message", nullable: false })
  message: string;

  @Column({ type: "json", name: "meta", nullable: true })
  meta: DataObject | null;
}
