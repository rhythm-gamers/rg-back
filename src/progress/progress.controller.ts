import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { ProgressService } from "./service/progress.service";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { UpdateProgressDto } from "./dto/update-progress.dto";
import { Response } from "express";
import { TokenPayload } from "src/auth/object/token-payload.obj";
import {
  getAllOnesPropertyWithKeynum,
  getRankingProperties,
} from "./obj/swagger-properties.obj";
import { SkipAuth } from "src/token/token.metadata";

@Controller("progress")
@ApiTags("progress")
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get("level-test/spec/:testId")
  @ApiParam({
    name: "testId",
    description: "특정 레벨 테스트 달성도를 조회하기 위한 레벨테스트 id",
  })
  @ApiOperation({ summary: "유저의 레벨 테스트 달성도 조회" })
  @ApiOkResponse({
    description: "레벨 테스트 달성도 조회 성공",
    schema: {
      type: "object",
      properties: {
        currentRate: { type: "string", example: "90.01" },
        updatedAt: { type: "string", example: "2024-03-23T03:50:36.000Z" },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "레벨 테스트 달성도 조회 실패",
    schema: { type: "string", example: "레벨 테스트 결과 없음" },
  })
  async fetchLevelTestProgress(
    @Req() req,
    @Res() res: Response,
    @Param("testId") testId,
  ) {
    const user: TokenPayload = req.user;
    const levelTestProgress = await this.progressService.fetchLeveltestProgress(
      +user.uid,
      +testId,
    );
    res.status(HttpStatus.OK).send(levelTestProgress);
  }

  @Get("level-test/all/:keyNum?")
  @ApiOperation({ summary: "유저의 모든 레벨 테스트 달성도 조회" })
  @ApiParam({
    name: "keyNum",
    description: "특정 키의 결과를 얻어오고 싶을 때 사용",
    required: false,
  })
  @ApiOkResponse({
    description: "조회 성공",
    schema: getAllOnesPropertyWithKeynum("level-test"),
  })
  async fetchAllLevelTestProgress(
    @Req() req,
    @Res() res: Response,
    @Param("keyNum") keyNum: number,
  ) {
    const user: TokenPayload = req.user;
    const result = await this.progressService.fetchAllLevelTestProgress(
      +user.uid,
      +keyNum,
    );
    res.status(HttpStatus.OK).send(result);
  }

  @Post("level-test/:testId")
  @ApiOperation({ summary: "레벨 테스트 달성도 업데이트/생성" })
  @ApiCreatedResponse({
    description: "레벨 테스트 달성도 생성 성공",
    schema: {
      type: "object",
      properties: {
        currentRate: { type: "number", example: 90.01 },
        updatedAt: { type: "string", example: "2024-03-23T03:50:36.000Z" },
      },
    },
  })
  @ApiOkResponse({
    description: "레벨 테스트 달성도 업데이트 성공 - null 값이 반환될 수 있음",
    schema: {
      type: "object",
      properties: {
        currentRate: { type: "number", example: 90.01 },
        updatedAt: { type: "string", example: "2024-03-23T03:50:36.000Z" },
      },
      nullable: true,
    },
  })
  @ApiBadRequestResponse({
    description: "레벨 테스트 달성도 업데이트 실패",
    schema: { type: "string", example: "해당 레벨 테스트는 없습니다." },
  })
  async updateLevelTestProgress(
    @Req() req,
    @Res() res: Response,
    @Body() body: UpdateProgressDto,
    @Param("testId") testId: number,
  ) {
    const user: TokenPayload = req.user;
    const result = await this.progressService.updateLeveltestProgress(
      +body.progress,
      +user.uid,
      +testId,
    );
    if (result.type === "create") {
      res.status(HttpStatus.CREATED).send(result.data);
    } else {
      res.status(HttpStatus.OK).send(result.data);
    }
  }

  @Get("practice/spec/:practiceId")
  @ApiOperation({ summary: "유저의 패턴 연습 달성도 조회" })
  @ApiOkResponse({
    description: "패턴 연습 달성도 조회 성공",
    schema: {
      type: "object",
      properties: {
        currentRate: { type: "string", example: "90.01" },
        updatedAt: { type: "string", example: "2024-03-23T03:50:36.000Z" },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "패턴 연습 조회 실패",
    schema: { type: "string", example: "패턴 연습 결과 없음" },
  })
  async fetchPracticeProgress(
    @Req() req,
    @Res() res: Response,
    @Param("practiceId") practiceId: number,
  ) {
    const user: TokenPayload = req.user;
    const practiceProgress =
      await await this.progressService.fetchPracticeProgress(
        +user.uid,
        +practiceId,
      );
    res.status(HttpStatus.OK).send(practiceProgress);
  }

  @Get("practice/all/:keyNum?")
  @ApiOperation({ summary: "유저의 모든 패턴 연습 달성도 조회" })
  @ApiParam({
    name: "keyNum",
    description: "특정 키의 결과를 얻어오고 싶을 때 사용",
    required: false,
  })
  @ApiOkResponse({
    description: "조회 성공",
    schema: getAllOnesPropertyWithKeynum("practice"),
  })
  async fetchAllPracticeProgress(
    @Req() req,
    @Res() res: Response,
    @Param("keyNum") keyNum: number,
  ) {
    const user: TokenPayload = req.user;
    const result = await this.progressService.fetchAllPracticeProgress(
      +user.uid,
      +keyNum,
    );
    res.status(HttpStatus.OK).send(result);
  }

  @Post("practice/:practiceId")
  @ApiOperation({ summary: "패턴 연습 달성도 업데이트/생성" })
  @ApiCreatedResponse({
    description: "패턴 연습 달성도 생성 성공",
    schema: {
      type: "object",
      properties: {
        currentRate: { type: "number", example: 90.01 },
        updatedAt: { type: "string", example: "2024-03-23T03:50:36.000Z" },
      },
    },
  })
  @ApiOkResponse({
    description: "패턴 연습 달성도 업데이트 성공 - null 값이 반환될 수 있음",
    schema: {
      type: "object",
      properties: {
        currentRate: { type: "number", example: 90.01 },
        updatedAt: { type: "string", example: "2024-03-23T03:50:36.000Z" },
      },
      nullable: true,
    },
  })
  @ApiBadRequestResponse({
    description: "패턴 연습 달성도 업데이트 실패",
    schema: { type: "string", example: "해당 패턴 연습은 없습니다." },
  })
  async updatePracticeProgress(
    @Req() req,
    @Res() res: Response,
    @Body() body: UpdateProgressDto,
    @Param("practiceId") practiceId: number,
  ) {
    const user: TokenPayload = req.user;
    const result = await this.progressService.updatePracticeProgress(
      +body.progress,
      +user.uid,
      +practiceId,
    );
    if (result.type === "create") {
      res.status(HttpStatus.CREATED).send(result.data);
    } else {
      res.status(HttpStatus.OK).send(result.data);
    }
  }

  @SkipAuth()
  @Get("ranking/level-test/:id")
  @ApiParam({
    name: "id",
    description: "랭킹을 보고싶은 레벨 테스트의 id",
  })
  @ApiOkResponse({
    description: "랭킹 조회 성공",
    schema: getRankingProperties(),
  })
  @ApiBadRequestResponse({
    description: "해당 레벨 테스트는 없음",
    schema: {
      type: "string",
      example: "해당 레벨 테스트는 없습니다.",
    },
  })
  async fetchLevetestRanking(@Res() res: Response, @Param("id") id: number) {
    const result = await this.progressService.fetchLevelTestRanking(+id);
    res.status(HttpStatus.OK).send(
      result.map((r) => {
        return {
          rating: r.currentRate,
          date: r.updatedAt,
          nickname: r.user.nickname,
        };
      }),
    );
  }

  @SkipAuth()
  @Get("ranking/practice/:id")
  @ApiParam({
    name: "id",
    description: "랭킹을 보고싶은 패턴 연습의 id",
  })
  @ApiOkResponse({
    description: "랭킹 조회 성공",
    schema: getRankingProperties(),
  })
  @ApiBadRequestResponse({
    description: "해당 패턴 연습은 없음",
    schema: {
      type: "string",
      example: "해당 패턴 연습은 없습니다.",
    },
  })
  async fetchPracticeRanking(@Res() res: Response, @Param("id") id: number) {
    const result = await this.progressService.fetchPracticeRanking(+id);
    res.status(HttpStatus.OK).send(
      result.map((r) => {
        return {
          rating: r.currentRate,
          date: r.updatedAt,
          nickname: r.user.nickname,
        };
      }),
    );
  }
}
