import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { ErrorCodes } from '../error_codes/entities/error_codes.entity';

const CACHE_KEY_PREFIX = 'error_code:';

@Injectable()
export class ErrorCodesCacheService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(ErrorCodes)
    private errorCodesRepository: Repository<ErrorCodes>,
  ) {}

  /**
   * This lifecycle hook runs once the module has been initialized.
   * It will fetch all error codes and store them in the cache.
   */
  async onModuleInit() {
    await this.primeCache();
  }

  async primeCache() {
    const errorCodes = await this.errorCodesRepository.find();
    for (const errorCode of errorCodes) {
      await this.set(errorCode);
    }
    console.log('Error cache has been primed.');
  }

  /**
   * Retrieves a single error code from the cache.
   * If not found, it will fetch from the DB, cache it, and then return it.
   */
  async get(code: string): Promise<ErrorCodes | null> {
    const cacheKey = `${CACHE_KEY_PREFIX}${code}`;
    let errorCode = await this.cacheManager.get<ErrorCodes>(cacheKey);

    if (!errorCode) {
      errorCode = await this.errorCodesRepository.findOne({ where: { code } });
      if (errorCode) {
        await this.set(errorCode);
      }
    }
    return errorCode;
  }

  /**
   * Sets or updates an error code in the cache.
   */
  async set(errorCode: ErrorCodes): Promise<void> {
    const cacheKey = `${CACHE_KEY_PREFIX}${errorCode.code}`;
    await this.cacheManager.set(cacheKey, errorCode);
  }

  /**
   * Deletes an error code from the cache.
   */
  async del(code: string): Promise<void> {
    const cacheKey = `${CACHE_KEY_PREFIX}${code}`;
    await this.cacheManager.del(cacheKey);
  }
}
