import {
  Column,
  Entity,
  Index
} from "typeorm";
import { Base } from "../../base/base.entity";
import { uuidV7ValueTransformer } from "../../transformer/uuidv7-binary16.transformer";

// Indexes discovered at generation time
@Entity("error_translations")
export class ErrorTranslations extends Base {
  @Column({ type: "text", name: "description", nullable: true })
  description: string | null;

  @Index()
  @Column({
    type: "binary",
    name: "error_code",
    nullable: false,
    transformer: uuidV7ValueTransformer,
  })
  error_code: string;

  @Column({
    type: "varchar",
    name: "language_code",
    nullable: false,
    length: 10,
  })
  language_code: string;

  @Column({ type: "varchar", name: "message", nullable: false, length: 255 })
  message: string;
}
