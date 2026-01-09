import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from '../../base/base.entity';
import { Users } from '../../users/entities/users.entity';

@Entity('errors')
export class Errors extends Base {
  @Column({ type: 'longtext', name: 'message', nullable: false })
  message: string;

  @Column({ type: 'longtext', name: 'code', nullable: false })
  code: string;

  @Column({ type: 'longtext', name: 'other', nullable: true })
  other: string | null;

  @Column({
    type: 'varchar',
    name: 'ref',
    nullable: false,
    length: 255,
    unique: true,
  })
  ref: string;

  @ManyToOne(() => Users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  users_data: Users;
}
