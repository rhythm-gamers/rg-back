import { Body, Controller, Param, Post } from '@nestjs/common';
import { ProgressService } from './service/progress.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Controller('progress')
@ApiTags('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('level-test/:id')
  @ApiOperation({})
  async updateLevelTest(
    @Body() body: UpdateProgressDto,
    @Param('id') id: number,
  ) {
    const user_id = 1;
    return await this.progressService.updateLeveltest(
      +body.progress,
      +user_id,
      +id,
    );
  }

  @Post('practice/:id')
  @ApiOperation({})
  async updatePractice(
    @Body() body: UpdateProgressDto,
    @Param('id') id: number,
  ) {
    const user_id = 1;
    return await this.progressService.updatePractice(
      +body.progress,
      +user_id,
      +id,
    );
  }
}
