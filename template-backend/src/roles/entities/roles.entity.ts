import { Column, Entity, Index } from 'typeorm';
import { Base } from '../../base/base.entity';
import { StatusEnum } from '../../users/enums/status.enum';

@Entity('roles')
export class Roles extends Base {
  @Column({
    type: 'varchar',
    name: 'name',
    nullable: false,
    length: 190,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'code',
    nullable: false,
    length: 50,
    unique: true,
  })
  code: string;

  @Column({ type: 'enum', name: 'status', nullable: false, enum: StatusEnum, default: StatusEnum.Active })
  status: StatusEnum;
}
