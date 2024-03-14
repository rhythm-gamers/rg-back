import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { WikiService } from "./wiki.service";
import { WikiMetadataOrigin } from "./obj/wiki-metadata-origin.obj";
import { ReturnWikiMetadataDto } from "./dto/return-wiki-metadata.dto";
import { ReturnWikiDataDto } from "./dto/return-wiki-data.dto";
import { CreateWikiDataDto } from "./dto/create-wiki-data.dto";
import { UpdateWikiDataDto } from "./dto/update-wiki-data.dto";
import { DeleteWikiDataDto } from "./dto/delete-wiki-data.dto";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { SkipAuth } from "src/token/token.metadata";

@Controller("wiki")
@ApiTags("wiki")
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @SkipAuth()
  @Get("metadata")
  @ApiOperation({})
  async getWikiMetadata(): Promise<ReturnWikiMetadataDto> {
    const metadatas: WikiMetadataOrigin[] =
      await this.wikiService.getWikiMetadata();

    const result: ReturnWikiMetadataDto = {};
    metadatas.forEach((metadata) => {
      if (!result[metadata.letter]) {
        result[metadata.letter] = [];
      }
      result[metadata.letter].push({
        uid: metadata.uid,
        title: metadata.title,
        mustRead: metadata.mustRead,
      });
    });
    return result;
  }

  @SkipAuth()
  @Get("spec/:id")
  @ApiParam({
    name: "위키 id",
    required: true,
  })
  @ApiOperation({})
  async getWikiData(@Param("id") id: number): Promise<ReturnWikiDataDto> {
    const result: ReturnWikiDataDto = await this.wikiService.getWikiData(id);
    return result;
  }

  // TODO Auth 필요
  @Post()
  @ApiOperation({})
  async createtWikiData(@Body() wiki: CreateWikiDataDto) {
    const result = await this.wikiService.createWikiData(wiki);
    return result;
  }

  // TODO Auth 필요
  @Put(":originTitle")
  @ApiOperation({})
  async updateWikiData(
    @Body() wiki: UpdateWikiDataDto,
    @Param("originTitle") originTitle: string,
  ) {
    const result = await this.wikiService.updateWikiDataByTitle(
      wiki,
      originTitle,
    );
    return result;
  }

  // TODO Auth 필요
  @Delete()
  @ApiOperation({ description: "제목 또는 인덱스로 제거할 수 있도록 함" })
  async deleteWikiData(@Body() wikiDelete: DeleteWikiDataDto) {
    let result;
    if (wikiDelete.title) {
      result = await this.wikiService.deleteWikiDataByTitle(wikiDelete.title);
    } else if (wikiDelete.wikiId) {
      result = await this.wikiService.deleteWikiDataById(+wikiDelete.wikiId);
    }

    return result;
  }
}
