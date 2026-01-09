import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { Files } from "./entities/files.entity";
import { FilesSubscriber } from "./subscribers/files.subscriber";

@Module({
  imports: [TypeOrmModule.forFeature([Files])],
  controllers: [FilesController],
  providers: [FilesService, FilesSubscriber],
  exports: [FilesService],
})
export class FilesModule {}
