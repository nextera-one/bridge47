import { PartialType } from "@nestjs/swagger";
import { CreateLogsDto } from "./create-logs.dto";

export class UpdateLogsDto extends PartialType(CreateLogsDto) {}
