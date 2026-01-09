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

// Indexes discovered at generation time
@Entity("auth_tokens")
export class AuthTokens extends Base {
  @Index()
  @Column({
    type: "binary",
    name: "user",
    nullable: false,
    length: 16,
    transformer: uuidV7ValueTransformer,
  })
  user: string;

  @Column({ type: "text", name: "jwt", nullable: false })
  jwt: string;

  @Column({ type: "date", name: "expires_at", nullable: true })
  expires_at: Date | null;

  @Column({ type: "date", name: "revoked_at", nullable: true })
  revoked_at: Date | null;

  @Column({
    type: "varchar",
    name: "fingerprint",
    nullable: false,
    length: 100,
  })
  fingerprint: string;
}
