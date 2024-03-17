import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { PracticeService } from "../service/practice.service";
import { PatternService } from "../pattern.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdatePracticeDto } from "../dto/update-practice.dto";
import { Practice } from "../entity/practice.entity";
import { CreatePracticeDto } from "../dto/create-practice.dto";
import { SkipAuth } from "src/token/token.metadata";

@ApiTags("practice")
@Controller("practice")
export class PracticeController {
  private readonly DIRECTORY = "practice";
  constructor(
    private readonly practiceService: PracticeService,
    private readonly patternService: PatternService,
  ) {}

  @Post()
  @ApiOperation({ summary: "패턴 연습 생성" })
  async createPractice(@Body() createData: CreatePracticeDto) {
    await this.patternService.buildCreateData(createData, this.DIRECTORY);
    const result = await this.practiceService.createEntity(createData);
    return result;
  }

  @SkipAuth()
  @Get()
  @ApiOperation({ summary: "패턴 연습 정보 가져오기" })
  async fetchPracticeInfo(@Query("id") id: number) {
    const result = await this.practiceService.fetchById(+id);
    return result;
  }

  @SkipAuth()
  @Get("all")
  @ApiOperation({ summary: "모든 패턴 연습 정보 가져오기" })
  async fetchAllPracticeInfo() {
    const result = await this.practiceService.fetchAll();
    return result;
  }

  @Patch(":id")
  @ApiOperation({ summary: "패턴 연습 채보, 패턴 정보 등 업데이트" })
  async updatePractice(
    @Param("id") id: number,
    @Body() updateData: UpdatePracticeDto,
  ) {
    const practiceEntity: Practice = await this.practiceService.fetchById(+id);
    if (
      // 제목 변경 X
      updateData.title === undefined ||
      updateData.title === practiceEntity.title
    ) {
      updateData.title = practiceEntity.title;
    } else {
      // 제목 변경 O
      await this.patternService.move(
        practiceEntity,
        updateData,
        this.DIRECTORY,
      );
    }
    await this.patternService.buildUpdateData(updateData, this.DIRECTORY);

    const result = await this.practiceService.updateData(+id, updateData);
    return result;
  }

  @Delete(":id")
  @ApiOperation({ summary: "패턴 연습 제거" })
  async deletePractice(@Param("id") id: number) {
    const practice: Practice = await this.practiceService.fetchById(+id);
    if (practice == null) {
      return 0;
    }
    await this.patternService.delete(practice);
    return await this.practiceService.deleteById(+id);
  }
}
