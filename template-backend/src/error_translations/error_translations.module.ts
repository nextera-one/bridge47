import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ErrorTranslations } from "./entities/error_translations.entity";
import { ErrorTranslationsController } from "./error_translations.controller";
import { ErrorTranslationsService } from "./error_translations.service";
import { ErrorTranslationsSubscriber } from "./subscribers/error_translations.subscriber";

@Module({
  imports: [TypeOrmModule.forFeature([ErrorTranslations])],
  controllers: [ErrorTranslationsController],
  providers: [ErrorTranslationsService, ErrorTranslationsSubscriber],
  exports: [ErrorTranslationsService],
})
export class ErrorTranslationsModule {}
