import { Column, PrimaryColumn, ViewEntity } from 'typeorm';

import {
  EncryptionOutputFormat,
  EncryptionTransformer,
} from '../encryption/encryption-transformer';

@ViewEntity({
  name: 'user_view',
})
export class UserView {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'created_at' })
  created_at: Date;

  @Column({ name: 'created_by' })
  created_by: string;

  @Column({ name: 'updated_at' })
  updated_at: Date;

  @Column({ name: 'updated_by' })
  updated_by: string;

  @Column({
    name: 'first_name',
    transformer: new EncryptionTransformer(EncryptionOutputFormat.STRING),
  })
  first_name: string;

  @Column({
    name: 'last_name',
    transformer: new EncryptionTransformer(EncryptionOutputFormat.STRING),
  })
  last_name: string;

  @Column({
    name: 'email',
    transformer: new EncryptionTransformer(EncryptionOutputFormat.STRING),
  })
  email: string;

  @Column({
    name: 'mobile',
    transformer: new EncryptionTransformer(EncryptionOutputFormat.STRING),
  })
  mobile: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'role' })
  role: string;

  @Column({ name: 'active' })
  active: boolean;

  @Column({ name: 'profile_image' })
  profile_image: string;

  @Column({ name: 'color' })
  color: string;

  @Column({ name: 'online' })
  online: boolean;
}
