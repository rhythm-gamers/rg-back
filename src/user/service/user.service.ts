import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { And, IsNull, Not, Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { AwsS3Service } from "src/s3/aws-s3.service";
import { PlateDataService } from "src/plate/service/plate-data.service";
import axios from "axios";
import { CodecService } from "src/codec/codec.service";
import { FirebaseService } from "src/firebase/firebase.service";
import { UpdateChinghoDto } from "../../chingho/dto/update-chingho.dto";
import { PlateData } from "../../plate/entity/plate-data.entity";
import { UpdatePlatedataDto } from "../../plate/dto/update-platedata.dto";
import { RegisterDto } from "src/auth/dto/register.dto";
import { PlateSettingService } from "src/plate/service/plate-setting.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly s3Service: AwsS3Service,
    private readonly plateDataService: PlateDataService,
    private readonly codecService: CodecService,
    private readonly firebaseService: FirebaseService,
    private readonly plateSettingService: PlateSettingService,
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

  async fetchWithRegisterId(registerId: string) {
    return await this.userRepository.findOneBy({ registerId: registerId });
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
    try {
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
    } catch (err) {
      throw new Error("Not Exist User");
    }
  }

  async fetchPlatedata(userId: number) {
    const user: User = await this.userRepository.findOne({
      select: {
        id: true,
        profileImage: true,
        introduction: true,
      },
      where: {
        id: userId,
      },
      relations: {
        plateSetting: true,
      },
    });
    delete user.plateSetting.id;

    const result = {
      profileImage: user.profileImage == null ? "" : user.profileImage,
      introduction: user.introduction,
    };
    const plateData = await this.plateDataService.fetch(userId);

    result["backgroundDesign"] = plateData.backgroundDesign;
    result["currentChingho"] = {
      level: plateData.rareness,
      title: plateData.title,
    };
    result["currentHavingGame"] = await this.fetchHavinggames(userId);
    result["currentLevel"] = plateData.currentLevel;

    result["showFlags"] = user.plateSetting;

    console.log(result);
    return result;
  }

  async fetchHavinggamesWithNickname(nickname: string) {
    try {
      const user = await this.userRepository.findOne({
        select: {
          id: true,
        },
        where: {
          nickname: nickname,
        },
      });
      return await this.fetchHavinggames(user.id);
    } catch (err) {
      throw new Error("Not Exist User");
    }
  }

  async fetchHavinggames(userid: number) {
    const chinghos = await this.firebaseService.get(`chingho/${userid}/스팀`);
    const datas = await this.firebaseService.get(`chingho/database/c`);
    delete datas["0"];
    const result = [];

    try {
      // null object를 forEach 돌린 경우 에러 발생
      Object.keys(chinghos).forEach((key) => {
        Object.keys(chinghos[key]).forEach((game) => {
          result.push(datas[game]);
        });
      });
    } catch (err) {}

    return result;
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

  async updateLeveltestLevel(
    userid: number,
    dto: UpdateChinghoDto | UpdatePlatedataDto,
  ) {
    return await this.plateDataService.update(userid, dto);
  }

  async fetchLeveltestLevel(userid: number) {
    const data: PlateData = await this.plateDataService.fetch(userid);
    return data.currentLevel;
  }

  async isDuplicatedNickname(nickname: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ nickname: nickname });
    return user ? true : false;
  }

  async isDuplicatedRegisterId(registreId: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ registerId: registreId });
    return user ? true : false;
  }

  async create(registerDto: RegisterDto) {
    let newUser = this.userRepository.create({
      registerId: registerDto.username,
      nickname: registerDto.nickname,
      password: registerDto.password,
    });
    newUser = await this.userRepository.save(newUser);
    newUser.plateSetting = await this.plateSettingService.create();
    newUser.plateData = await this.plateDataService.create();

    try {
      return await this.userRepository.save(newUser);
    } catch (e) {
      console.log(e);
    }
  }
}
