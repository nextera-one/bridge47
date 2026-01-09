import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

import { uuidV7ValueTransformer } from '../transformer/uuidv7-binary16.transformer';
import { UserView } from './user_view.entity';
const LogsEntity = () => require('../logs/entities/logs.entity').Logs;
@Index('id_UNIQUE', ['id'], { unique: true })
export abstract class Base extends BaseEntity {
  @PrimaryColumn({
    type: 'binary',
    length: 16,
    transformer: uuidV7ValueTransformer,
  })
  id: string;

  @Column('bigint', {
    name: 'created_at',
    // transformer: TimestampToDateTransformer,
  })
  created_at: Date;

  @Column('binary', {
    name: 'created_by',
    length: 16,
    transformer: uuidV7ValueTransformer,
  })
  created_by: string;

  @Column('bigint', {
    name: 'updated_at',
    // transformer: TimestampToDateTransformer,
  })
  updated_at: Date;

  @Column('binary', {
    name: 'updated_by',
    length: 16,
    transformer: uuidV7ValueTransformer,
  })
  updated_by: string;

  @ManyToOne(() => UserView, { eager: false })
  @JoinColumn([{ name: 'created_by', referencedColumnName: 'id' }])
  created_by_user: UserView;

  @ManyToOne(() => UserView, { eager: false })
  @JoinColumn([{ name: 'updated_by', referencedColumnName: 'id' }])
  updated_by_user: UserView;

  @Column('binary', {
    name: 'log',
    length: 16,
    transformer: uuidV7ValueTransformer,
    nullable: true,
  })
  log?: string;

  @ManyToOne(() => LogsEntity(), { eager: false, nullable: true })
  @JoinColumn({ name: 'log', referencedColumnName: 'id' })
  logs_data?: Relation<InstanceType<ReturnType<typeof LogsEntity>>>;

  @BeforeInsert()
  init() {
    const now = new Date();
    if (!this.id) {
      this.id = uuidv7();
      this.created_at = now;
    }
    this.updated_at = now;
  }

  @BeforeUpdate()
  setUpdateTimestamp() {
    this.updated_at = new Date();
  }
}
