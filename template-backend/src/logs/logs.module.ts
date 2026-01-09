import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogsService } from "./logs.service";
import { LogsController } from "./logs.controller";
import { Logs } from "./entities/logs.entity";
import { LogsSubscriber } from "./subscribers/logs.subscriber";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Logs])],
  controllers: [LogsController],
  providers: [LogsService, LogsSubscriber],
  exports: [LogsService],
})
export class LogsModule {}
