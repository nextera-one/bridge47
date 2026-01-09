import GeneratorHelper from '../utils/generator.helper';

export function generateAppModule(moduleNames: string[]): string {
  const importStatements = moduleNames
    .map(
      (moduleName) =>
        `import { ${GeneratorHelper.snakeToPascal(
          moduleName,
        )}Module } from './${moduleName}/${moduleName}.module';`,
    )
    .join('\n');

  const importModules = moduleNames
    .map(
      (moduleName) => `${GeneratorHelper.snakeToPascal(moduleName)}Module,`,
    )
    .join('\n    ');

  return `
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core/constants';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PassportModule } from '@nestjs/passport';
import * as NestJsScheduleModule from '@nestjs/schedule';
import { AuditingSubscriber } from 'typeorm-auditing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClsModule } from 'nestjs-cls';
import * as path from 'path';
import { JwtGlobalModule } from './common/security/jwt.module';
import { Block404Middleware } from './common/middlewares/block-404.middleware';

import { RedirectMiddleware } from './common/middlewares/redirect.middleware';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { RayIdMiddleware } from './common/middlewares/ray-id.middleware';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ThrottlersUtil } from './utils/throttlers.util';
import { AuthModule } from "./auth/auth.module";
// --- Dynamically Generated Module Imports ---
${importStatements}
// --- End Generated Module Imports ---

const getEnvFilePath = (): string => {
  const env = process.env.NODE_ENV;

  switch (env) {
    case 'production': return path.resolve(__dirname, '..', '.env.prod');
    case 'development': return path.resolve(__dirname, '..', '.env.dev');
    case 'qa': return path.resolve(__dirname, '..', '.env.qa');
    case 'uat': return path.resolve(__dirname, '..', '.env.uat');
    default: return path.resolve(__dirname, '..', '.env');
  }
};

@Module({
  imports: [
      ThrottlerModule.forRoot([
      {
        ttl: 60_000,   // window in ms
        limit: 100,    // max requests per window
      },
    ]),
    CacheModule.register({ isGlobal: true, ttl: 3600 }),
    ConfigModule.forRoot({ envFilePath: getEnvFilePath(), isGlobal: true, ignoreEnvFile: false }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req) => {
          cls.set('user', req.user);
        },
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
          type: configService.get<string>('DATABASE_TYPE') || 'mysql',
          host: configService.get<string>('DATABASE_HOST'),
          port:
            parseInt(configService.get<string>('DATABASE_PORT') || '3366') ||
            3366,
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          subscribers: [AuditingSubscriber],
          synchronize:
            configService.get<string>('DATABASE_SYNC').toLowerCase() === 'true',
          logging:
            configService.get<string>('DATABASE_LOGGING').toLowerCase() ===
            'true',
          logger: 'advanced-console',
          retryAttempts: configService.get<number>('DATABASE_RETRY_ATTEMPTS'),
          retryDelay: seconds(
            configService.get<number>('DATABASE_RETRY_DELAY_SECONDS'),
          ),
          extra: {
            connectionLimit:
              parseInt(
                configService.get<string>('DATABASE_CONNECTION_LIMIT') || '10',
              ) || 10,
            connectTimeout: configService.get<number>('DATABASE_CONNECT_TIMEOUT') || 10000,
            // acquireTimeout: configService.get<number>('DATABASE_ACQUIRE_TIMEOUT') || 10000,
            enableKeepAlive: configService.get<boolean>('DATABASE_KEEP_ALIVE') || configService.get<string>('DATABASE_KEEP_ALIVE').toLowerCase() === 'true',
            keepAliveInitialDelay: configService.get<number>('DATABASE_KEEP_ALIVE_INITIAL_DELAY') || 0,
            waitForConnections:
              configService
                .get<string>('DATABASE_WAIT_FOR_CONNECTIONS')
                .toLowerCase() === 'true',
            queueLimit:
              parseInt(
                configService.get<string>('DATABASE_QUEUE_LIMIT') || '10',
              ) || 10,
          },
      } as TypeOrmModuleOptions),
    }),
    JwtGlobalModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NestJsScheduleModule.ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthModule,
    // --- Dynamically Generated Modules ---
    ${importModules}
    // --- End Generated Modules ---
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RedirectMiddleware, RayIdMiddleware, Block404Middleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
`;
}