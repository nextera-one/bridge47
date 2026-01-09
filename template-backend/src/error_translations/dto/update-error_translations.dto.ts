import { PartialType } from "@nestjs/swagger";
import { CreateErrorTranslationsDto } from "./create-error_translations.dto";

export class UpdateErrorTranslationsDto extends PartialType(
  CreateErrorTranslationsDto,
) {}
