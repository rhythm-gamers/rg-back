import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WikiService } from './wiki.service';
import { WikiMetadataOrigin } from './obj/wiki-metadata-origin.obj';
import { ReturnWikiMetadata } from './dto/return-wiki-metadata.dto';
import { ReturnWikiData } from './dto/return-wiki-data.dto';
import { InsertWikiData } from './dto/insert-wiki-data.dto';
import { UpdateWikiData } from './dto/update-wiki-data.dto';

@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Get('metadata')
  async getWikiMetadata(): Promise<ReturnWikiMetadata> {
    const metadatas: WikiMetadataOrigin[] =
      await this.wikiService.getWikiMetadata();

    const result: ReturnWikiMetadata = {};
    metadatas.forEach((metadata) => {
      if (!result[metadata.letter]) {
        result[metadata.letter] = [];
      }
      result[metadata.letter].push({
        uid: metadata.uid,
        title: metadata.title,
        must_read: metadata.must_read,
      });
    });
    return result;
  }

  @Get('spec/:id')
  async getWikiData(@Param('id') id: number): Promise<ReturnWikiData> {
    const result: ReturnWikiData = await this.wikiService.getWikiData(id);
    return result;
  }

  // TODO:
  //  Auth 필요
  @Post('')
  async insertWikiData(@Body() wiki: InsertWikiData) {
    const result = await this.wikiService.insertWikiData(wiki);
    return result;
  }

  // TODO:
  //  Auth 필요
  @Put('spec/:title')
  async updateWikiData(
    @Body() wiki: UpdateWikiData,
    @Param('title') title: string,
  ) {
    const result = await this.wikiService.updateWikiDataByTitle(wiki, title);
    return result;
  }

  // TODO:
  //  Auth 필요
  @Delete('spec/:title')
  async deleteWikiData(@Param('title') title: string) {
    const result = await this.wikiService.deleteWikiDataByTitle(title);
    return result;
  }
}
