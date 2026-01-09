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
import { uuidV7ValueTransformer } from "../../transformer/uuidv7-binary16.transformer";
import { StatusEnum } from "../enums/status.enum";
import { Users } from "../../users/entities/users.entity";
import { ErrorCodes } from "../../error_codes/entities/error_codes.entity";

// Indexes discovered at generation time
@Entity("reported_errors")
export class ReportedErrors extends Base {
  @Index()
  @Column({
    type: "binary",
    name: "error_code",
    nullable: false,
    length: 16,
    transformer: uuidV7ValueTransformer,
  })
  error_code: string;

  @Column({
    type: "binary",
    name: "user",
    nullable: true,
    length: 16,
    transformer: uuidV7ValueTransformer,
  })
  user: string | null;

  @Column({ type: "varchar", name: "path", nullable: true, length: 255 })
  path: string | null;

  @Column({ type: "text", name: "user_comment", nullable: true })
  user_comment: string | null;

  @Column({ type: "enum", name: "status", nullable: false, enum: StatusEnum })
  status: StatusEnum;
}
