import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRolesService } from "./user_roles.service";
import { UserRolesController } from "./user_roles.controller";
import { UserRoles } from "./entities/user_roles.entity";
import { UserRolesSubscriber } from "./subscribers/user_roles.subscriber";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserRoles])],
  controllers: [UserRolesController],
  providers: [UserRolesService, UserRolesSubscriber],
  exports: [UserRolesService],
})
export class UserRolesModule {}
