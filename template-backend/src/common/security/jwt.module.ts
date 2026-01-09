// src/security/jwt-global.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET_KEY', 'change-me'),
        signOptions: {
          expiresIn: cfg.get<string | number>('JWT_EXPIRES_IN', '1h') as any,
        },
      }),
    }),
  ],
  exports: [JwtModule], // 👈 makes JwtService available everywhere
})
export class JwtGlobalModule {}
