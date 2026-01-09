import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Base } from '../../base/base.entity';
import { ErrorTranslations } from '../../error_translations/entities/error_translations.entity';
import { BoolBitTransformer } from '../../transformer/bool_bit.transformer';
import { Users } from '../../users/entities/users.entity';

@Entity('error_codes')
export class ErrorCodes extends Base {
  @Column({
    type: 'varchar',
    name: 'code',
    nullable: false,
    length: 50,
    unique: true,
  })
  code: string;

  @Column({ type: 'int', name: 'http_status_code', nullable: false })
  http_status_code: number;

  @Column({
    type: 'varchar',
    name: 'default_message',
    nullable: false,
    length: 255,
  })
  default_message: string;

  @Column({ type: 'text', name: 'default_description', nullable: true })
  default_description: string | null;

  @Column({
    type: 'bit',
    name: 'is_reportable',
    nullable: false,
    transformer: new BoolBitTransformer(),
  })
  is_reportable: boolean;
}
