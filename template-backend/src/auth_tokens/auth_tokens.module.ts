import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthTokensService } from "./auth_tokens.service";
import { AuthTokensController } from "./auth_tokens.controller";
import { AuthTokens } from "./entities/auth_tokens.entity";
import { AuthTokensSubscriber } from "./subscribers/auth_tokens.subscriber";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuthTokens])],
  controllers: [AuthTokensController],
  providers: [AuthTokensService, AuthTokensSubscriber],
  exports: [AuthTokensService],
})
export class AuthTokensModule {}
