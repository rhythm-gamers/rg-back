import { Body, Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import { ProgressService } from "./service/progress.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateProgressDto } from "./dto/update-progress.dto";
import { Response } from "express";

@Controller("progress")
@ApiTags("progress")
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get("level-test/:testId")
  @ApiOperation({})
  async fetchLevelTestProgress(
    @Req() req,
    @Res() res: Response,
    @Param("testId") testId,
  ) {
    const user = req.user;
    const levelTestProgress = await this.progressService.fetchLeveltestProgress(
      +user.uid,
      +testId,
    );
    res.status(200).send(levelTestProgress);
  }

  @Post("level-test/:testId")
  @ApiOperation({})
  async updateLevelTestProgress(
    @Req() req,
    @Body() body: UpdateProgressDto,
    @Param("testId") testId: number,
  ) {
    const user = req.user;
    return await this.progressService.updateLeveltestProgress(
      +body.progress,
      +user.uid,
      +testId,
    );
  }

  @Get("practice/:practiceId")
  @ApiOperation({})
  async fetchPracticeProgress(
    @Req() req,
    @Res() res: Response,
    @Param("practiceId") practiceId: number,
  ) {
    const user = req.user;
    const practiceProgress =
      await await this.progressService.fetchPracticeProgress(
        +user.uid,
        +practiceId,
      );
    res.status(200).send(practiceProgress);
  }

  @Post("practice/:practiceId")
  @ApiOperation({})
  async updatePracticeProgress(
    @Req() req,
    @Body() body: UpdateProgressDto,
    @Param("practiceId") practiceId: number,
  ) {
    const user = req.user;
    return await this.progressService.updatePracticeProgress(
      +body.progress,
      +user.uid,
      +practiceId,
    );
  }
}
