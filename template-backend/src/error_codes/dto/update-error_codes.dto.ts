import { PartialType } from "@nestjs/swagger";
import { CreateErrorCodesDto } from "./create-error_codes.dto";

export class UpdateErrorCodesDto extends PartialType(CreateErrorCodesDto) {}
