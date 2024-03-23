import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
import { WikiService } from "./wiki.service";
import { WikiMetadataOrigin } from "./obj/wiki-metadata-origin.obj";
import { ReturnWikiMetadataDto } from "./dto/return-wiki-metadata.dto";
import { ReturnWikiDto } from "./dto/return-wiki.dto";
import { CreateWikiDto } from "./dto/create-wiki.dto";
import { UpdateWikiDto } from "./dto/update-wiki.dto";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Roles, SkipAuth } from "src/token/token.metadata";
import { Role } from "src/auth/object/token-payload.obj";
import { Response } from "express";
import {
  metadataOkProperty,
  wikiCreateProperties,
  wikiProperties,
} from "./obj/swagger-properties.obj";

@Controller("wiki")
@ApiTags("wiki")
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @SkipAuth()
  @ApiOperation({ summary: "위키 메타데이터 가져오기" })
  @Get("metadata")
  @ApiOkResponse({
    description: "메타데이터(제목, 필독 여부) 반환",
    schema: {
      type: "object",
      properties: metadataOkProperty(),
    },
  })
  async fetchWikiMetadata(@Res() res: Response) {
    const metadatas: WikiMetadataOrigin[] =
      await this.wikiService.fetchMetadata();
    const result: ReturnWikiMetadataDto = {
      mustread: [],
    };
    metadatas.forEach((metadata) => {
      if (metadata.mustRead === true) {
        result.mustread.push(this.generateMetadata(metadata));
      }
      if (result[metadata.letter] == null) {
        result[metadata.letter] = [];
      }
      result[metadata.letter].push(this.generateMetadata(metadata));
    });
    res.status(HttpStatus.OK).send(result);
  }

  private generateMetadata(metadata: WikiMetadataOrigin) {
    return {
      wikiId: metadata.wikiId,
      title: metadata.title,
      mustRead: metadata.mustRead,
    };
  }

  @SkipAuth()
  @ApiOperation({ summary: "위키 내용 가져오기" })
  @Get("spec/:title")
  @ApiParam({
    name: "title",
    required: true,
    example: "test",
    description: "가져오려는 위키 제목",
  })
  @ApiOkResponse({
    description: "위키 데이터 반환",
    schema: {
      type: "object",
      properties: wikiProperties(),
    },
  })
  @ApiBadRequestResponse({
    description: "해당 데이터 없음",
    schema: {
      type: "string",
      example: "해당 위키 데이터는 없습니다.",
    },
  })
  async fetchWikiData(@Param("title") title: string, @Res() res: Response) {
    const result: ReturnWikiDto = await this.wikiService.fetch(title);
    if (result) {
      res.status(HttpStatus.OK).send(result);
    } else {
      res.status(HttpStatus.BAD_REQUEST).send("해당 위키 데이터는 없습니다.");
    }
  }

  @Roles(Role.Admin)
  @Post()
  @ApiOperation({ summary: "위키 생성" })
  @ApiOkResponse({
    description: "생성 성공",
    schema: {
      type: "object",
      properties: wikiCreateProperties(),
    },
  })
  @ApiBadRequestResponse({
    description: "이미 있는 데이터",
    schema: {
      type: "string",
      example: "이미 있는 위키입니다.",
    },
  })
  async createtWikiData(@Body() wiki: CreateWikiDto, @Res() res: Response) {
    const result = await this.wikiService.create(wiki);
    res.status(HttpStatus.OK).send(result);
  }

  @Roles(Role.Admin)
  @Patch(":originTitle")
  @ApiOperation({ summary: "위키 내용 업데이트" })
  @ApiParam({
    name: "originTitle",
    description: "업데이트 하는 위키의 원래 이름",
    required: true,
    example: "test",
  })
  @ApiOkResponse({
    description: "수정 성공",
    schema: {
      type: "object",
      properties: {
        generatedMaps: { type: "array", example: [] },
        raw: { type: "array", example: [] },
        affected: { type: "number", example: "1" },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "수정 실패 - 바꾸려는 위키가 없음",
    schema: {
      type: "string",
      example: "해당 위키는 없습니다.",
    },
  })
  @ApiConflictResponse({
    description: "수정 실패 - 바꾸려는 위키의 제목이 이미 존재함",
    schema: {
      type: "string",
      example: "바꾸려는 위키의 제목이 이미 존재합니다.",
    },
  })
  async updateWikiData(
    @Body() wiki: UpdateWikiDto,
    @Param("originTitle") originTitle: string,
    @Res() res: Response,
  ) {
    const result = await this.wikiService.updateByTitle(wiki, originTitle);
    res.status(200).send(result);
  }

  @Roles(Role.Admin)
  @Delete(":title")
  @ApiOperation({ summary: "제목으로 제거할 수 있도록 함" })
  @ApiParam({
    name: "title",
    description: "삭제하려는 위키의 제목",
    required: true,
    example: "test",
  })
  @ApiOkResponse({
    description: "삭제 성공",
    schema: {
      type: "string",
      example: "삭제 성공",
    },
  })
  @ApiBadRequestResponse({
    description: "삭제 실패 or 데이터베이스에 없는 위키",
    schema: {
      type: "string",
      example: "해당 위키는 없습니다.",
    },
  })
  async deleteWikiData(@Param("title") title: string, @Res() res: Response) {
    const result = await this.wikiService.deleteByTitle(title);
    if (result.affected === 0) {
      res.status(HttpStatus.NOT_FOUND).send("데이터베이스에 없는 위키");
    } else {
      res.status(HttpStatus.OK).send("제거 성공");
    }
  }
}
