import { PartialType } from "@nestjs/swagger";
import { CreateWikiDataDto } from "./create-wiki-data.dto";

export class UpdateWikiDataDto extends PartialType(CreateWikiDataDto) {}
