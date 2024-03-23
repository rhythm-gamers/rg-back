import { PartialType } from "@nestjs/swagger";
import { CreateBoardDto } from "./create-board.dto";

export class ModifyBoardDto extends PartialType(CreateBoardDto) {}
