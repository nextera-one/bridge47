import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportedErrorsService } from "./reported_errors.service";
import { ReportedErrorsController } from "./reported_errors.controller";
import { ReportedErrors } from "./entities/reported_errors.entity";
import { ReportedErrorsSubscriber } from "./subscribers/reported_errors.subscriber";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ReportedErrors])],
  controllers: [ReportedErrorsController],
  providers: [ReportedErrorsService, ReportedErrorsSubscriber],
  exports: [ReportedErrorsService],
})
export class ReportedErrorsModule {}
