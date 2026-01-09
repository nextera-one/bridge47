import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ErrorCodes } from "./entities/error_codes.entity";
import { ErrorCodesController } from "./error_codes.controller";
import { ErrorCodesService } from "./error_codes.service";
import { ErrorCodesSubscriber } from "./subscribers/error_codes.subscriber";

@Module({
  imports: [TypeOrmModule.forFeature([ErrorCodes])],
  controllers: [ErrorCodesController],
  providers: [ErrorCodesService, ErrorCodesSubscriber],
  exports: [ErrorCodesService],
})
export class ErrorCodesModule {}
