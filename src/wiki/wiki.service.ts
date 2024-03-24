import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wiki } from "./entity/wiki.entity";
import { Repository } from "typeorm";
import { WikiMetadataOrigin } from "./obj/wiki-metadata-origin.obj";
import { ReturnWikiDto } from "./dto/return-wiki.dto";
import { CreateWikiDto } from "./dto/create-wiki.dto";
import { UpdateWikiDto } from "./dto/update-wiki.dto";

@Injectable()
export class WikiService {
  constructor(
    @InjectRepository(Wiki) private wikiRepository: Repository<Wiki>,
  ) {}

  async fetchMetadata(): Promise<WikiMetadataOrigin[]> {
    const metadatas = await this.wikiRepository.find({
      select: {
        wikiId: true,
        letter: true,
        title: true,
        mustRead: true,
      },
      order: {
        title: "ASC",
      },
    });
    return metadatas;
  }

  async fetch(title: string): Promise<ReturnWikiDto> {
    const data = await this.wikiRepository.findOne({
      select: {
        title: true,
        content: true,
        mustRead: true,
      },
      where: {
        title: title,
      },
    });
    return data;
  }

  async create(wiki: CreateWikiDto) {
    const res = await this.wikiRepository.findOne({
      where: {
        title: wiki.title,
      },
    });
    if (res) {
      throw new BadRequestException("이미 있는 내용입니다.");
    }
    const wikiAppend: Wiki = new Wiki();
    wikiAppend.title = wiki.title;
    wikiAppend.letter = this.getChosung(wiki.title);
    wikiAppend.content = wiki.content;
    if (wiki.mustRead) {
      wikiAppend.mustRead = wiki.mustRead;
    }

    return await this.wikiRepository.save(wikiAppend);
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

  async updateByTitle(wiki: UpdateWikiDto, originTitle: string) {
    const findData = await this.wikiRepository.find({
      where: [{ title: originTitle }, { title: wiki.title }],
    });
    if (findData.length > 1) {
      throw new ConflictException("바꾸려는 위키의 제목과 일치합니다.");
    }
    const data = findData.find((dat) => dat.title === originTitle);
    if (data == null) {
      throw new BadRequestException("해당 위키는 없습니다.");
    }

    const letter =
      wiki.title == null ? data.letter : this.getChosung(wiki.title);
    const result = await this.wikiRepository.update(
      {
        wikiId: data.wikiId,
      },
      { ...wiki, letter: letter },
    );

    return result;
  }

  async deleteById(id: number) {
    return await this.wikiRepository.delete(id);
  }

  async deleteByTitle(title: string) {
    const res = await this.wikiRepository.delete({
      title: title,
    });
    return res;
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
