import { PartialType } from "@nestjs/swagger";
import { CreateReportedErrorsDto } from "./create-reported_errors.dto";

export class UpdateReportedErrorsDto extends PartialType(
  CreateReportedErrorsDto,
) {}
