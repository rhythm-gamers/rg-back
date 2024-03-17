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
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateLevelTestDto } from "../dto/create-level-test.dto";
import { PatternService } from "../pattern.service";
import { LevelTestService } from "../service/level-test.service";
import { UpdateLevelTestDto } from "../dto/update-level-test.dto";
import { LevelTest } from "../entity/level-test.entity";

@ApiTags("level test")
@Controller("level-test")
export class LevelTestController {
  private readonly DIRECTORY = "level-test";
  constructor(
    private readonly patternService: PatternService,
    private readonly levelTestService: LevelTestService,
  ) {}

  @Post()
  @ApiOperation({ summary: "레벨테스트 생성" })
  async createLevelTest(@Body() createData: CreateLevelTestDto) {
    await this.patternService.buildCreateData(createData, this.DIRECTORY);
    const result = await this.levelTestService.createEntity(createData);
    return result;
  }

  @Get()
  @ApiOperation({ summary: "레벨테스트 정보 가져오기" })
  async fetchLevelTestInfo(@Query("id") id: number) {
    const result = await this.levelTestService.fetchById(+id);
    return result;
  }

  @Get("all") // level-tests로?
  @ApiOperation({ summary: "모든 레벨 테스트 정보 가져오기" })
  async fetchAllLevelTestInfo() {
    const result = await this.levelTestService.fetchAll();
    return result;
  }

  @Patch(":id")
  @ApiOperation({ summary: "레벨테스트 채보, 패턴 정보 등 업데이트" })
  async updateLevelTest(
    @Param("id") id: number,
    @Body() updateData: UpdateLevelTestDto,
  ) {
    const levelTestEntity: LevelTest =
      await this.levelTestService.fetchById(+id);
    updateData.keyNum = levelTestEntity.keyNum;
    if (
      // 제목 변경 X
      updateData.title === undefined ||
      updateData.title === levelTestEntity.title
    ) {
      updateData.title = levelTestEntity.title;
    } else {
      // 제목 변경 O
      await this.patternService.move(
        levelTestEntity,
        updateData,
        this.DIRECTORY,
      );
    }
    await this.patternService.buildUpdateData(updateData, this.DIRECTORY);

    const result = await this.levelTestService.updateData(+id, updateData);
    return result;
  }

  @Delete(":id")
  @ApiOperation({ summary: "레벨테스트 삭제" })
  async delete(@Param("id") id: number) {
    const levelTest = await this.levelTestService.fetchById(+id);
    if (levelTest == null) {
      return 0;
    }
    this.patternService.delete(levelTest);
    return await this.levelTestService.deleteById(+id);
  }
}
