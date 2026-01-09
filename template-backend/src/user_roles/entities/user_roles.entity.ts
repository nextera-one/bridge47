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
import { Users } from "../../users/entities/users.entity";
import { Roles } from "../../roles/entities/roles.entity";

// Indexes discovered at generation time
@Index("uk_user_roles_user_role", ["user_id", "role_id"], { unique: true })
@Entity("user_roles")
export class UserRoles extends Base {
  @Column({
    type: "binary",
    name: "user_id",
    nullable: false,
    length: 16,
    transformer: uuidV7ValueTransformer,
  })
  user_id: string;

  @Index()
  @Column({
    type: "binary",
    name: "role_id",
    nullable: false,
    length: 16,
    transformer: uuidV7ValueTransformer,
  })
  role_id: string;

  @OneToOne(() => Roles, { eager: false })
  @JoinColumn({ name: "role_id", referencedColumnName: "id" })
  role: Roles;

  @OneToOne(() => Users, { eager: false })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: Users;
}
