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
import { BoolBitTransformer } from "../../transformer/bool_bit.transformer";
import { uuidV7ValueTransformer } from "../../transformer/uuidv7-binary16.transformer";
import { Users } from "../../users/entities/users.entity";

// Indexes discovered at generation time
@Entity("files")
export class Files extends Base {
  @Index()
  @Column({
    type: "binary",
    name: "parent",
    nullable: true,
    length: 16,
    transformer: uuidV7ValueTransformer,
  })
  parent: string | null;

  @Column({
    type: "bit",
    name: "linked",
    nullable: false,
    transformer: new BoolBitTransformer(),
  })
  linked: boolean;

  @Column({ type: "json", name: "other", nullable: true })
  other: DataObject | null;

  @Column({ type: "varchar", name: "ext", nullable: true, length: 255 })
  ext: string | null;

  @Column({ type: "int", name: "size", nullable: true })
  size: number | null;

  @Column({ type: "varchar", name: "linked_to", nullable: true, length: 255 })
  linked_to: string | null;

  @Column({ type: "json", name: "permissions", nullable: true })
  permissions: DataObject | null;

  @Column({ type: "int", name: "is_directory", nullable: false })
  is_directory: number;

  @Index()
  @Column({
    type: "binary",
    name: "linked_to_id",
    nullable: true,
    length: 16,
    transformer: uuidV7ValueTransformer,
  })
  linked_to_id: string | null;

  @OneToMany(() => Files, (files) => files.parent)
  files_by_parent: Files[];

  @OneToMany(() => Users, (users) => users.avatar_file)
  users_by_avatar_file: Users[];
}
