import { PartialType } from "@nestjs/swagger";
import { CreateUserRolesDto } from "./create-user_roles.dto";

export class UpdateUserRolesDto extends PartialType(CreateUserRolesDto) {}
