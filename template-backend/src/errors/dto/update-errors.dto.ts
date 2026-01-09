import { PartialType } from "@nestjs/swagger";
import { CreateErrorsDto } from "./create-errors.dto";

export class UpdateErrorsDto extends PartialType(CreateErrorsDto) {}
