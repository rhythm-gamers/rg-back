import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { And, IsNull, Not, Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { AwsS3Service } from "src/s3/aws-s3.service";
import { PlateDataService } from "./service/plate-data.service";
import { UserTitleService } from "./service/user-title.service";
import axios from "axios";
import { CodecService } from "src/codec/codec.service";
import { FirebaseService } from "src/firebase/firebase.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly s3Service: AwsS3Service,
    private readonly plateDataService: PlateDataService,
    private readonly userTitleService: UserTitleService,
    private readonly codecService: CodecService,
    private readonly firebaseService: FirebaseService,
  ) {}

  private readonly PROFILE_IMAGE_PATH: string = "profile-image";
  private readonly EC2_BUCKET_PATH: string = process.env.AWS_S3_BUCKER_URL;

  async fetchAllWithExistSteamId(): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        steamId: true,
      },
      where: {
        steamId: And(Not(""), Not(IsNull())),
      },
    });
  }

  async fetchWithUserId(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    return user;
  }

  async fetchWithNickname(nickname: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      nickname: nickname,
    });
    return user;
  }

  async fetchUserLikeListWithUserID(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        commentLikeList: {
          comment: true,
        },
        postLikeList: {
          post: true,
        },
      },
    });
    return user;
  }

  async fetchUserPracticeProgressWithUserId(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        practiceProgresses: {
          practice: true,
        },
      },
    });
    return user;
  }

  async fetchUserLevelTestProgressWithUserId(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        levelTestProgresses: {
          levelTest: true,
        },
      },
    });
    return user;
  }

  async uploadUserProfileImage(nickname: string, image: string) {
    try {
      const file = Buffer.from(image, "base64");
      this.s3Service.upload(`${this.PROFILE_IMAGE_PATH}/${nickname}`, file);
    } catch (base64Error) {
      throw new BadRequestException("Base64로 인코딩된 파일이 아닙니다.");
    }
  }

  fetchUserProfileImage(nickname: string): string {
    return this.EC2_BUCKET_PATH + `/${this.PROFILE_IMAGE_PATH}/${nickname}`;
  }

  async fetchPlatedataByNickname(nickname: string) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
      },
      where: {
        nickname: nickname,
      },
    });
    const data = await this.fetchPlatedata(user.id);
    return data;
  }

  async fetchPlatedata(userId: number) {
    const user: User = await this.userRepository.findOne({
      select: {
        id: true,
        profileImage: true,
        plateSetting: {
          id: true,
          showChingho: true,
          showChinghoIco: true,
          showComment: true,
          showLevel: true,
        },
        introduction: true,
      },
      where: {
        id: userId,
      },
      relations: {
        plateSetting: true,
        userTitle: true,
      },
    });
    console.log(user);
    const dataFlag = {
      chingho: user.plateSetting.showChingho,
      comment: user.plateSetting.showComment,
      level: user.plateSetting.showLevel,
    };
    console.log(dataFlag);
    const plateDatas = await this.plateDataService.fetch(
      userId,
      // dataFlag,
    );
    console.log(plateDatas);
    const titleDatas =
      user.plateSetting.showChinghoIco === true ? user.userTitle : {};
    console.log(titleDatas);
    return 1;
  }

  async fetchIntroduction(userId: number) {
    const result = await this.userRepository.findOne({
      select: {
        introduction: true,
      },
      where: {
        id: userId,
      },
    });
    return result.introduction;
  }

  async updateIntroduction(userId: number, introduction: string) {
    const result = await this.userRepository.update(userId, {
      introduction: introduction,
    });
    return result;
  }

  async saveUserSteamUID(uid: number, steamUID: string) {
    const result = await this.userRepository.update(uid, {
      steamId: steamUID,
    });
    return result;
  }

  async updateNickname(uid: number, nickname: string) {
    const isExisting = await this.userRepository.findOne({
      where: {
        nickname: nickname,
      },
    });
    if (isExisting) {
      throw new ConflictException("이미 사용중인 닉네임입니다.");
    }

    const result = await this.userRepository.update(uid, {
      nickname: nickname,
    });
    return result;
  }

  async getUserSteamgameList(
    steamid,
  ): Promise<Array<Record<string, string | number>>> {
    const rhythmgames = await this.firebaseService.get("chingho/database/c");
    try {
      delete rhythmgames["0"];
    } catch (err) {
      delete rhythmgames[0];
    }

    const rhythmGameList: Array<string | number> = Object.keys(rhythmgames);
    const params = {
      key: process.env.STEAM_API_KEY,
      steamid: steamid,
      format: "json",
      include_appinfo: true,
      appids_filter: rhythmGameList,
    };

    const games = await axios.get(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`,
      { params },
    );
    const gamesObj: Array<Record<string, string | number>> =
      games.data.response.games;

    const data = [];
    gamesObj.forEach((game) => {
      data.push({
        name: game.name,
        playtime: game.playtime_windows_forever,
        appid: game.appid,
      });
    });

    return data;
  }
}
