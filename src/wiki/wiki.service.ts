import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wiki } from './entity/wiki.entity';
import { Repository } from 'typeorm';
import { WikiMetadataOrigin } from './obj/wiki-metadata-origin.obj';
import { ReturnWikiData } from './dto/return-wiki-data.dto';
import { InsertWikiData } from './dto/insert-wiki-data.dto';
import { UpdateWikiData } from './dto/update-wiki-data.dto';

@Injectable()
export class WikiService {
  constructor(
    @InjectRepository(Wiki) private wikiRepository: Repository<Wiki>,
  ) {}

  async getWikiMetadata(): Promise<WikiMetadataOrigin[]> {
    const metadatas = await this.wikiRepository.find({
      select: {
        uid: true,
        letter: true,
        title: true,
        must_read: true,
      },
    });
    return metadatas;
  }

  async getWikiData(id: number): Promise<ReturnWikiData> {
    const data = await this.wikiRepository.findOne({
      select: {
        title: true,
        content: true,
        must_read: true,
      },
      where: {
        uid: id,
      },
    });
    return data;
  }

  async insertWikiData(wiki: InsertWikiData) {
    const wiki_append: Wiki = new Wiki();

    wiki_append.title = wiki.title;
    wiki_append.letter = this.getChosung(wiki.title);
    wiki_append.content = wiki.content;
    if (wiki.must_read) {
      wiki_append.must_read = wiki.must_read;
    }

    return await this.wikiRepository.insert(wiki_append);
  }

  private getChosung(input: string): string {
    const char_code = input.charCodeAt(0);
    if (char_code >= 0xac00 && char_code <= 0xd7a3) {
      // '가'로부터의 거리를 구하고, 초성의 인덱스를 계산
      const index = Math.floor((char_code - 0xac00) / 28 / 21);
      // 초성 반환
      return chosungs[index];
    } else {
      // 한글이 아닐 경우 입력값 그대로 반환
      return input.at(0);
    }
  }

  async updateWikiDataByTitle(wiki: UpdateWikiData, title: string) {
    const data = await this.wikiRepository.findOne({
      where: {
        title: title,
      },
    });
    let letter = data.letter;
    if (wiki.title) {
      letter = this.getChosung(wiki.title);
    }
    const update_data = { ...data, ...wiki, letter };

    return await this.wikiRepository.save(update_data);
  }

  async deleteWikiData(id: number) {
    return await this.wikiRepository.delete(id);
  }

  async deleteWikiDataByTitle(title: string) {
    const wiki = await this.wikiRepository.findOne({
      where: {
        title: title,
      },
    });
    if (wiki) {
      return await this.wikiRepository.remove(wiki);
    } else {
      return wiki;
    }
  }
}

const chosungs = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];
