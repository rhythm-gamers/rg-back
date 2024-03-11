import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LevelTestService } from './service/level-test.service';
import { CreateLevelTestDto } from './dto/create-level-test.dto';
import { UpdateLevelTestDto } from './dto/update-level-test.dto';
import { PracticeService } from './service/practice.service';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { AwsS3Service } from 'src/s3/aws-s3.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PatternService } from './pattern.service';
import { LevelTest } from './entity/level-test.entity';
import { AwsS3MoveFileDto } from 'src/s3/dao/aws-s3-move-files.dto';
import { Practice } from './entity/practice.entity';

@Controller('pattern')
export class PatternController {
  constructor(
    private readonly levelTestService: LevelTestService,
    private readonly practiceService: PracticeService,
    private readonly awsS3Service: AwsS3Service,
    private readonly patternService: PatternService,
  ) {}

  // level test
  @Post('level-test')
  @ApiTags('level test')
  @ApiOperation({ summary: '레벨테스트 생성' })
  async createLevelTest(@Body() createData: CreateLevelTestDto) {
    createData.imgSrc =
      createData.imgSrc !== undefined
        ? await this.patternService.upload(
            'level-test',
            createData.title,
            'img',
            createData.imgSrc,
          )
        : await this.patternService.copy(
            'level-test',
            `${createData.title}/img`,
          );
    createData.noteSrc =
      createData.noteSrc !== undefined
        ? await this.patternService.upload(
            'level-test',
            createData.title,
            'note',
            createData.noteSrc,
          )
        : await this.patternService.copy(
            'level-test',
            `${createData.title}/note`,
          );
    const result = await this.levelTestService.createEntity(createData);
    return result;
  }

  @Get('level-test')
  @ApiTags('level test')
  @ApiOperation({ summary: '레벨테스트 정보 가져오기' })
  async fetchLevelTestInfo(@Query('id') id: number) {
    const result = await this.levelTestService.fetchById(+id);
    return result;
  }

  @Get('level-test/all') // level-tests로?
  @ApiTags('level test')
  @ApiOperation({ summary: '모든 레벨 테스트 정보 가져오기' })
  async fetchAllLevelTestInfo() {
    const result = await this.levelTestService.fetchAll();
    return result;
  }

  @Patch('level-test/:id')
  @ApiTags('level test')
  @ApiOperation({ summary: '레벨테스트 채보, 패턴 정보 등 업데이트' })
  async updateLevelTest(
    @Param('id') id: number,
    @Body() updateData: UpdateLevelTestDto,
  ) {
    // 1. 원본 entity fetch
    //   1.1 변경할 파일 이름이 이전의 이름과 같다면 ← updateData.title === undefined or === prevValue.title
    //     1.1.1 변경할 파일이 있다면
    //       1.1.1.1 파일 업로드
    //     1.2.1 변경할 파일이 없다면 pass
    //   1.2 변경할 파일 이름이 이전의 이름과 다르다면 ← 로직이 비효율적이지만 구현이 간단
    //     1.2.1 파일 이동
    //     1.2.2 파일 업로드
    // 2. entity 수정
    // 3. update
    const levelTestInfo: LevelTest = await this.levelTestService.fetchById(+id);
    if (
      // 제목 변경 X
      updateData.title === undefined ||
      updateData.title === levelTestInfo.title
    ) {
      updateData.noteSrc =
        updateData.noteSrc !== undefined
          ? await this.patternService.upload(
              'level-test',
              updateData.title,
              'note',
              updateData.noteSrc,
            )
          : levelTestInfo.noteSrc;

      updateData.imgSrc =
        updateData.imgSrc !== undefined
          ? await this.patternService.upload(
              'level-test',
              updateData.title,
              'img',
              updateData.imgSrc,
            )
          : levelTestInfo.imgSrc;
    } else {
      // 제목 변경 O
      const moveInfo = new Array<AwsS3MoveFileDto>();
      moveInfo.push(
        {
          originKey: levelTestInfo.imgSrc,
          destinationKey: `level-test/${updateData.title}/img`,
        },
        {
          originKey: levelTestInfo.noteSrc,
          destinationKey: `level-test/${updateData.title}/note`,
        },
      );
      await this.awsS3Service.move(moveInfo);

      updateData.imgSrc =
        updateData.imgSrc !== undefined
          ? await this.patternService.upload(
              'level-test',
              updateData.title,
              'img',
              updateData.imgSrc,
            )
          : `level-test/${updateData.title}/img`;
      updateData.noteSrc =
        updateData.noteSrc !== undefined
          ? await this.patternService.upload(
              'level-test',
              updateData.title,
              'note',
              updateData.noteSrc,
            )
          : `level-test/${updateData.title}/note`;
    }
    const result = await this.levelTestService.updateData(+id, updateData);
    return result;
  }

  @Delete('level-test/:id')
  @ApiTags('level test')
  @ApiOperation({ summary: '레벨테스트 삭제' })
  async delete(@Param('id') id: number) {
    const levelTestInfo = await this.levelTestService.fetchById(+id);
    await this.awsS3Service.delete([
      levelTestInfo.imgSrc,
      levelTestInfo.noteSrc,
      levelTestInfo.imgSrc.split('/').slice(0, -1).join('/').padEnd(1, '/'),
    ]);
    return await this.levelTestService.deleteById(+id);
  }

  // practice
  @Post('practice')
  @ApiTags('practice')
  @ApiOperation({ summary: '패턴 연습 생성' })
  async createPractice(@Body() createData: CreatePracticeDto) {
    createData.imgSrc =
      createData.imgSrc !== undefined
        ? await this.patternService.upload(
            'practice',
            createData.title,
            'img',
            createData.imgSrc,
          )
        : await this.patternService.copy('practice', `${createData.title}/img`);
    createData.noteSrc =
      createData.noteSrc !== undefined
        ? await this.patternService.upload(
            'practice',
            createData.title,
            'note',
            createData.noteSrc,
          )
        : await this.patternService.copy(
            'practice',
            `${createData.title}/note`,
          );
    const result = await this.practiceService.createEntity(createData);
    return result;
  }

  @Get('practice')
  @ApiTags('practice')
  @ApiOperation({ summary: '패턴 연습 정보 가져오기' })
  async fetchPracticeInfo(@Query('id') id: number) {
    const result = await this.practiceService.fetchById(+id);
    return result;
  }

  @Get('practice/all')
  @ApiTags('practice')
  @ApiOperation({ summary: '모든 패턴 연습 정보 가져오기' })
  async fetchAllPracticeInfo() {
    const result = await this.practiceService.fetchAll();
    return result;
  }

  @Patch('practice/:id')
  @ApiTags('practice')
  @ApiOperation({ summary: '패턴 연습 채보, 패턴 정보 등 업데이트' })
  async updatePractice(
    @Param('id') id: number,
    @Body() updateData: UpdatePracticeDto,
  ) {
    const practiceInfo: Practice = await this.practiceService.fetchById(+id);
    if (
      // 제목 변경 X
      updateData.title === undefined ||
      updateData.title === practiceInfo.title
    ) {
      updateData.noteSrc =
        updateData.noteSrc !== undefined
          ? await this.patternService.upload(
              'level-test',
              updateData.title,
              'note',
              updateData.noteSrc,
            )
          : practiceInfo.noteSrc;

      updateData.imgSrc =
        updateData.imgSrc !== undefined
          ? await this.patternService.upload(
              'level-test',
              updateData.title,
              'img',
              updateData.imgSrc,
            )
          : practiceInfo.imgSrc;
    } else {
      // 제목 변경 O
      const moveInfo = new Array<AwsS3MoveFileDto>();
      moveInfo.push(
        {
          originKey: practiceInfo.imgSrc,
          destinationKey: `level-test/${updateData.title}/img`,
        },
        {
          originKey: practiceInfo.noteSrc,
          destinationKey: `level-test/${updateData.title}/note`,
        },
      );
      await this.awsS3Service.move(moveInfo);

      updateData.imgSrc =
        updateData.imgSrc !== undefined
          ? await this.patternService.upload(
              'level-test',
              updateData.title,
              'img',
              updateData.imgSrc,
            )
          : `level-test/${updateData.title}/img`;
      updateData.noteSrc =
        updateData.noteSrc !== undefined
          ? await this.patternService.upload(
              'level-test',
              updateData.title,
              'note',
              updateData.noteSrc,
            )
          : `level-test/${updateData.title}/note`;
    }
    const result = await this.practiceService.updateData(+id, updateData);
    return result;
  }

  @Delete('practice/:id')
  @ApiTags('practice')
  @ApiOperation({ summary: '패턴 연습 제거' })
  async deletePractice(@Param('id') id: number) {
    return await this.practiceService.deleteById(+id);
  }

  @ApiTags('test')
  @Post('test')
  async uploadTest(@Body() body: CreateLevelTestDto) {
    body.imgSrc = body.imgSrc
      ? await this.patternService.upload('test', body.title, 'img', body.imgSrc)
      : 'undefined.png';
    body.noteSrc = body.noteSrc
      ? await this.patternService.upload(
          'test',
          body.title,
          'note',
          body.noteSrc,
        )
      : 'undefined.note';

    const result = await this.levelTestService.createEntity(body);
    return result;
  }

  @ApiTags('test')
  @Get('test')
  async downloadTest(@Query('filename') filename: string) {
    const practiceResult = await this.practiceService.fetchById(11);
    const fileResult = await this.awsS3Service.download(filename);

    return {
      info: practiceResult,
      file: fileResult,
    };
  }
}
