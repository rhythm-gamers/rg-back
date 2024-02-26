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
import { ReturnWikiMetadataDto } from './dto/return-wiki-metadata.dto';
import { ReturnWikiDataDto } from './dto/return-wiki-data.dto';
import { CreateWikiDataDto } from './dto/create-wiki-data.dto';
import { UpdateWikiDataDto } from './dto/update-wiki-data.dto';
import { DeleteWikiDataDto } from './dto/delete-wiki-data.dto';

@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Get('metadata')
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
        must_read: metadata.must_read,
      });
    });
    return result;
  }

  @Get('spec/:id')
  async getWikiData(@Param('id') id: number): Promise<ReturnWikiDataDto> {
    const result: ReturnWikiDataDto = await this.wikiService.getWikiData(id);
    return result;
  }

  // TODO Auth 필요
  @Post('')
  async createtWikiData(@Body() wiki: CreateWikiDataDto) {
    const result = await this.wikiService.createWikiData(wiki);
    return result;
  }

  // TODO Auth 필요
  @Put('spec/:title')
  async updateWikiData(
    @Body() wiki: UpdateWikiDataDto,
    @Param('title') title: string,
  ) {
    const result = await this.wikiService.updateWikiDataByTitle(wiki, title);
    return result;
  }

  // TODO Auth 필요
  @Delete()
  async deleteWikiData(@Body() wiki_delete: DeleteWikiDataDto) {
    let result;
    if (wiki_delete.title) {
      result = await this.wikiService.deleteWikiDataByTitle(wiki_delete.title);
    } else if (wiki_delete.wiki_id) {
      result = await this.wikiService.deleteWikiDataById(+wiki_delete.wiki_id);
    }

    return result;
  }
}
