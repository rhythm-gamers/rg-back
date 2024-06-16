import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { AwsS3Service } from "src/s3/aws-s3.service";
import { PlateDataService } from "./service/plate-data.service";
import { UserTitleService } from "./service/user-title.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly s3Service: AwsS3Service,
    private readonly plateDataService: PlateDataService,
    private readonly userTitleService: UserTitleService,
  ) {}

  private readonly PROFILE_IMAGE_PATH: string = "profile-image";

  async fetchWithUserId(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id: userId,
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
  async fetchPlateDataByNickname(nickname: string) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
      },
      where: {
        nickname: nickname,
      },
    });
    const data = await this.fetchPlateData(user.id);
    return data;
  }

  async fetchPlateData(userId: number) {
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
    const plateDatas = await this.plateDataService.fetchPlateData(
      userId,
      dataFlag,
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
}
