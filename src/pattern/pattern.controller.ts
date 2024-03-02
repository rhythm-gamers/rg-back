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

@ApiTags('pattern')
@Controller('pattern')
// TODO 파일 받아오면 세이브하는 로직 추가 필요
export class PatternController {
  constructor(
    private readonly levelTestService: LevelTestService,
    private readonly practiceService: PracticeService,
    private readonly awsS3Service: AwsS3Service,
    private readonly patternService: PatternService,
  ) {}

  // level test
  @Post('level-test')
  @ApiOperation({ summary: '레벨테스트 생성' })
  async createLevelTest(@Body() create_data: CreateLevelTestDto) {
    create_data.img_src =
      create_data.img_src !== undefined
        ? await this.patternService.upload(
            'level-test',
            create_data.title,
            'img',
            create_data.img_src,
          )
        : await this.patternService.copy(
            'level-test',
            `${create_data.title}/img`,
          );
    create_data.note_src =
      create_data.note_src !== undefined
        ? await this.patternService.upload(
            'level-test',
            create_data.title,
            'note',
            create_data.note_src,
          )
        : await this.patternService.copy(
            'level-test',
            `${create_data.title}/note`,
          );
    const result = await this.levelTestService.createEntity(create_data);
    return result;
  }

  @Get('level-test')
  @ApiOperation({ summary: '레벨테스트 정보 가져오기' })
  async fetchLevelTestInfo(@Query('id') id: number) {
    const result = await this.levelTestService.fetchById(+id);
    return result;
  }

  @Get('level-test/all')
  @ApiOperation({ summary: '모든 레벨 테스트 정보 가져오기' })
  async fetchAllLevelTestInfo() {
    const result = await this.levelTestService.fetchAll();
    return result;
  }

  @Patch('level-test/:id')
  @ApiOperation({ summary: '레벨테스트 채보, 패턴 정보 등 업데이트' })
  async updateLevelTest(
    @Param('id') id: number,
    @Body() update_data: UpdateLevelTestDto,
  ) {
    // 1. 원본 entity fetch
    //   1.1 변경할 파일 이름이 이전의 이름과 같다면 ← update_data.title === undefined or === prev_value.title
    //     1.1.1 변경할 파일이 있다면
    //       1.1.1.1 파일 업로드
    //     1.2.1 변경할 파일이 없다면 pass
    //   1.2 변경할 파일 이름이 이전의 이름과 다르다면 ← 로직이 비효율적이지만 구현이 간단
    //     1.2.1 파일 이동
    //     1.2.2 파일 업로드
    // 2. entity 수정
    // 3. update
    const level_test_info: LevelTest =
      await this.levelTestService.fetchById(+id);
    if (
      // 제목 변경 X
      update_data.title === undefined ||
      update_data.title === level_test_info.title
    ) {
      update_data.note_src =
        update_data.note_src !== undefined
          ? await this.patternService.upload(
              'level-test',
              update_data.title,
              'note',
              update_data.note_src,
            )
          : level_test_info.note_src;

      update_data.img_src =
        update_data.img_src !== undefined
          ? await this.patternService.upload(
              'level-test',
              update_data.title,
              'img',
              update_data.img_src,
            )
          : level_test_info.img_src;
    } else {
      // 제목 변경 O
      const move_info = new Array<AwsS3MoveFileDto>();
      move_info.push(
        {
          origin_key: level_test_info.img_src,
          destination_key: `level-test/${update_data.title}/img`,
        },
        {
          origin_key: level_test_info.note_src,
          destination_key: `level-test/${update_data.title}/note`,
        },
      );
      await this.awsS3Service.move(move_info);

      update_data.img_src =
        update_data.img_src !== undefined
          ? await this.patternService.upload(
              'level-test',
              update_data.title,
              'img',
              update_data.img_src,
            )
          : `level-test/${update_data.title}/img`;
      update_data.note_src =
        update_data.note_src !== undefined
          ? await this.patternService.upload(
              'level-test',
              update_data.title,
              'note',
              update_data.note_src,
            )
          : `level-test/${update_data.title}/note`;
    }
    const result = await this.levelTestService.updateData(+id, update_data);
    return result;
  }

  @Delete('level-test/:id')
  @ApiOperation({ summary: '레벨테스트 삭제' })
  async delete(@Param('id') id: number) {
    const level_test_info = await this.levelTestService.fetchById(+id);
    await this.awsS3Service.delete([
      level_test_info.img_src,
      level_test_info.note_src,
      level_test_info.img_src.split('/').slice(0, -1).join('/').padEnd(1, '/'),
    ]);
    return await this.levelTestService.deleteById(+id);
  }

  // practice
  @Post('practice')
  @ApiOperation({ summary: '패턴 연습 생성' })
  async createPractice(@Body() create_data: CreatePracticeDto) {
    create_data.img_src =
      create_data.img_src !== undefined
        ? await this.patternService.upload(
            'practice',
            create_data.title,
            'img',
            create_data.img_src,
          )
        : await this.patternService.copy(
            'practice',
            `${create_data.title}/img`,
          );
    create_data.note_src =
      create_data.note_src !== undefined
        ? await this.patternService.upload(
            'practice',
            create_data.title,
            'note',
            create_data.note_src,
          )
        : await this.patternService.copy(
            'practice',
            `${create_data.title}/note`,
          );
    const result = await this.practiceService.createEntity(create_data);
    return result;
  }

  @Get('practice')
  @ApiOperation({ summary: '패턴 연습 정보 가져오기' })
  async fetchPracticeInfo(@Query('id') id: number) {
    const result = await this.practiceService.fetchById(+id);
    return result;
  }

  @Get('practice/all')
  @ApiOperation({ summary: '모든 패턴 연습 정보 가져오기' })
  async fetchAllPracticeInfo() {
    const result = await this.practiceService.fetchAll();
    return result;
  }

  @Patch('practice/:id')
  @ApiOperation({ summary: '패턴 연습 채보, 패턴 정보 등 업데이트' })
  async updatePractice(
    @Param('id') id: number,
    @Body() update_data: UpdatePracticeDto,
  ) {
    const practice_info: Practice = await this.practiceService.fetchById(+id);
    if (
      // 제목 변경 X
      update_data.title === undefined ||
      update_data.title === practice_info.title
    ) {
      update_data.note_src =
        update_data.note_src !== undefined
          ? await this.patternService.upload(
              'level-test',
              update_data.title,
              'note',
              update_data.note_src,
            )
          : practice_info.note_src;

      update_data.img_src =
        update_data.img_src !== undefined
          ? await this.patternService.upload(
              'level-test',
              update_data.title,
              'img',
              update_data.img_src,
            )
          : practice_info.img_src;
    } else {
      // 제목 변경 O
      const move_info = new Array<AwsS3MoveFileDto>();
      move_info.push(
        {
          origin_key: practice_info.img_src,
          destination_key: `level-test/${update_data.title}/img`,
        },
        {
          origin_key: practice_info.note_src,
          destination_key: `level-test/${update_data.title}/note`,
        },
      );
      await this.awsS3Service.move(move_info);

      update_data.img_src =
        update_data.img_src !== undefined
          ? await this.patternService.upload(
              'level-test',
              update_data.title,
              'img',
              update_data.img_src,
            )
          : `level-test/${update_data.title}/img`;
      update_data.note_src =
        update_data.note_src !== undefined
          ? await this.patternService.upload(
              'level-test',
              update_data.title,
              'note',
              update_data.note_src,
            )
          : `level-test/${update_data.title}/note`;
    }
    const result = await this.practiceService.updateData(+id, update_data);
    return result;
  }

  @Delete('practice/:id')
  @ApiOperation({ summary: '패턴 연습 제거' })
  async deletePractice(@Param('id') id: number) {
    return await this.practiceService.deleteById(+id);
  }

  @ApiTags('test')
  @Post('test')
  async uploadTest(@Body() body: CreateLevelTestDto) {
    body.img_src = body.img_src
      ? await this.patternService.upload(
          'test',
          body.title,
          'img',
          body.img_src,
        )
      : 'undefined.png';
    body.note_src = body.note_src
      ? await this.patternService.upload(
          'test',
          body.title,
          'note',
          body.note_src,
        )
      : 'undefined.note';

    const result = await this.levelTestService.createEntity(body);
    return result;
  }

  @ApiTags('test')
  @Get('test')
  async downloadTest(@Query('filename') filename: string) {
    const practice_result = await this.practiceService.fetchById(11);
    const file_result = await this.awsS3Service.download(filename);

    return {
      info: practice_result,
      file: file_result,
    };
  }
}
