import { Column, Entity } from 'typeorm';

import { Base } from '../../base/base.entity';
import DataObject from '../../model/data_object';

@Entity('auth')
export class Auth extends Base {
  @Column({ type: 'longtext', name: 'jwt', nullable: false })
  jwt: string;

  @Column({ type: 'json', name: 'data', nullable: false })
  data: DataObject;

  @Column({ type: 'int', name: 'expiry_timestamp', nullable: false })
  expiry_timestamp: number;

  @Column({ type: 'varchar', name: 'user', nullable: false, length: 255 })
  user: string;

  @Column({ type: 'longtext', name: 'fingerprint', nullable: true })
  fingerprint: string | null;
}
