import { PartialType } from "@nestjs/mapped-types";
import { PatternInfoObj } from "../obj/pattern-info.obj";

export class UpdatePatternInfoDto extends PartialType(PatternInfoObj) {}
