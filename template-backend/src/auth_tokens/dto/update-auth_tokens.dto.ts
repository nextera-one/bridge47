import { PartialType } from "@nestjs/swagger";
import { CreateAuthTokensDto } from "./create-auth_tokens.dto";

export class UpdateAuthTokensDto extends PartialType(CreateAuthTokensDto) {}
