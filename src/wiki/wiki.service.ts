import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wiki } from "./entity/wiki.entity";
import { Repository } from "typeorm";
import { WikiMetadataOrigin } from "./obj/wiki-metadata-origin.obj";
import { ReturnWikiDataDto } from "./dto/return-wiki-data.dto";
import { CreateWikiDataDto } from "./dto/create-wiki-data.dto";
import { UpdateWikiDataDto } from "./dto/update-wiki-data.dto";

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
        mustRead: true,
      },
    });
    return metadatas;
  }

  async getWikiData(id: number): Promise<ReturnWikiDataDto> {
    const data = await this.wikiRepository.findOne({
      select: {
        title: true,
        content: true,
        mustRead: true,
      },
      where: {
        uid: id,
      },
    });
    return data;
  }

  async createWikiData(wiki: CreateWikiDataDto) {
    const wikiAppend: Wiki = new Wiki();

    wikiAppend.title = wiki.title;
    wikiAppend.letter = this.getChosung(wiki.title);
    wikiAppend.content = wiki.content;
    if (wiki.mustRead) {
      wikiAppend.mustRead = wiki.mustRead;
    }

    return await this.wikiRepository.insert(wikiAppend);
  }

  private getChosung(input: string): string {
    const charCode = input.charCodeAt(0);
    if (charCode >= 0xac00 && charCode <= 0xd7a3) {
      // '가'로부터의 거리를 구하고, 초성의 인덱스를 계산
      const index = Math.floor((charCode - 0xac00) / 28 / 21);
      // 초성 반환
      return chosungs[index];
    } else {
      // 한글이 아닐 경우 입력값 그대로 반환
      return input.at(0);
    }
  }

  async updateWikiDataByTitle(wiki: UpdateWikiDataDto, title: string) {
    const data = await this.wikiRepository.findOne({
      where: {
        title: title,
      },
    });
    let letter = data.letter;
    if (wiki.title) {
      letter = this.getChosung(wiki.title);
    }
    const updateData = { ...data, ...wiki, letter };

    return await this.wikiRepository.save(updateData);
  }

  async deleteWikiDataById(id: number) {
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
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
