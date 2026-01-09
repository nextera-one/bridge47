import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { ErrorTranslations } from './entities/error_translations.entity';

const CACHE_KEY_PREFIX = 'translation:';

@Injectable()
export class ErrorTranslationsCacheService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(ErrorTranslations)
    private translationsRepository: Repository<ErrorTranslations>,
  ) {}

  async onModuleInit() {
    await this.primeCache();
  }

  async primeCache() {
    const translations = await this.translationsRepository.find();
    for (const translation of translations) {
      await this.set(translation);
    }
    console.log('Error translations cache has been primed.');
  }

  private getCacheKey(errorCodeId: string, lang: string): string {
    return `${CACHE_KEY_PREFIX}${errorCodeId}:${lang}`;
  }

  async get(
    errorCodeId: string,
    lang: string,
  ): Promise<ErrorTranslations | null> {
    const cacheKey = this.getCacheKey(errorCodeId, lang);
    const translation =
      await this.cacheManager.get<ErrorTranslations>(cacheKey);

    if (translation) {
      return translation;
    }

    // Fallback: If not in cache, fetch from DB and cache it
    const dbTranslation = await this.translationsRepository.findOne({
      where: { error_code: errorCodeId, language_code: lang },
    });

    if (dbTranslation) {
      await this.set(dbTranslation);
    }
    return dbTranslation;
  }

  async set(translation: ErrorTranslations): Promise<void> {
    const cacheKey = this.getCacheKey(
      translation.error_code,
      translation.language_code,
    );
    await this.cacheManager.set(cacheKey, translation);
  }

  async del(errorCodeId: string, lang: string): Promise<void> {
    const cacheKey = this.getCacheKey(errorCodeId, lang);
    await this.cacheManager.del(cacheKey);
  }
}
