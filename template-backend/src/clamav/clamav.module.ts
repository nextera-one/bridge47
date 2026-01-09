// src/security/clamav.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClamavService } from './clamav.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ClamavService,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) =>
        new ClamavService({
          host: cfg.get<string>('CLAMAV_HOST', '127.0.0.1'),
          port: parseInt(cfg.get<string>('CLAMAV_PORT', '3310'), 10),
          timeoutMs: cfg.get<number>('CLAMAV_TIMEOUT_MS', 20_000),
          enabled: (cfg.get<string>('CLAMAV_ENABLED') || 'true').toLowerCase() === 'true',
        }),
    },
  ],
  exports: [ClamavService],
})
export class ClamavModule {}
