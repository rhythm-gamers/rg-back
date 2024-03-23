import { PartialType } from "@nestjs/swagger";
import { CreateLevelTestDto } from "./create-level-test.dto";

export class UpdateLevelTestDto extends PartialType(CreateLevelTestDto) {}
