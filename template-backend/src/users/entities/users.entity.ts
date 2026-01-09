import { Column, Entity, Index, JoinColumn, OneToMany, ManyToOne, OneToOne } from 'typeorm';

import { uuidV7ValueTransformer } from '../../transformer/uuidv7-binary16.transformer';
import { UserRoles } from '../../user_roles/entities/user_roles.entity';
import { Files } from '../../files/entities/files.entity';
import { StatusEnum } from '../enums/status.enum';
import { Base } from '../../base/base.entity';
// import { NotificationTokens } from '../../notification_tokens/entities/notification_tokens.entity';

// Indexes discovered at generation time
@Entity('users')
export class Users extends Base {
  @Column({
    type: 'varchar',
    name: 'email',
    nullable: false,
    length: 190,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'username',
    nullable: false,
    length: 64,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    name: 'password',
    nullable: false,
    length: 255,
  })
  password?: string;

  @Column({
    type: 'varchar',
    name: 'display_name',
    nullable: true,
    length: 190,
  })
  display_name: string | null;

  @Index()
  @Column({
    type: 'binary',
    name: 'avatar_file_id',
    nullable: true,
    length: 16,
    transformer: uuidV7ValueTransformer,
  })
  avatar_file_id: string | null;

  @Column({ type: 'enum', name: 'status', nullable: false, enum: StatusEnum, default: StatusEnum.Active })
  status: StatusEnum;

  @ManyToOne(() => Files, { eager: false })
  @JoinColumn({ name: 'avatar_file_id', referencedColumnName: 'id' })
  avatar_file: Files;

  @OneToOne(() => UserRoles, (userRoles) => userRoles.user)
  user_roles: UserRoles;
  
  // @OneToMany(() => NotificationTokens, (notificationTokens) => notificationTokens.user)
  // notification_tokens: NotificationTokens[];
}
