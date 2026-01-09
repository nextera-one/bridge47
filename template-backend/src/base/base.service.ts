import { Inject, Injectable, Scope } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm';

import { Base } from './base.entity';
import CurrentUserModel from 'src/model/current_user.model';
import { ReadUsersDto } from 'src/users/dto/read-users.dto';

@Injectable({ scope: Scope.TRANSIENT })
export abstract class BaseService<T extends Base> {
  constructor(private readonly repository: Repository<T>) {}

  @Inject(ClsService)
  protected readonly clsService!: ClsService;
  /**
   * Returns the repository for the entity type.
   */
  getRepo(): Repository<T> {
    return this.repository;
  }
  /**
   * Returns the current user ID from the CLS context.
   */
  getCurrentUserId(): string | undefined {
    return this.clsService.get('userId');
  }

  //getCurrentUser
  getCurrentUser(): ReadUsersDto | undefined {
    return this.clsService.get('user');
  }
  /**
   * Returns the current log ID from the CLS context.
   */
  getCurrentLogId(): string | undefined {
    return this.clsService.get('logId');
  }
  /**
   * Returns the ClsService.
   */
  getClsService(): ClsService {
    return this.clsService;
  }

  //systemId
  getSystemId(): string | undefined {
    return this.clsService.get('systemId');
  }
}
