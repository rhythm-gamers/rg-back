import { BadRequestException, Injectable } from "@nestjs/common";
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
      userId: userId,
    });
    return user;
  }

  async fetchUserLikeListWithUserID(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        userId: userId,
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
        userId: userId,
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
        userId: userId,
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

  async fetchPlateData(userId: number) {
    const user: User = await this.userRepository.findOne({
      select: {
        userId: true,
        profileImage: true,
        platesetting: {
          plateSettingId: true,
          showChingho: true,
          showChinghoIco: true,
          showComment: true,
          showLevel: true,
        },
      },
      where: {
        userId: userId,
      },
      relations: {
        platesetting: true,
        usertitle: true,
      },
    });
    console.log(user);
    const dataFlag = {
      chingho: user.platesetting.showChingho,
      comment: user.platesetting.showComment,
      level: user.platesetting.showLevel,
    };
    const plateDatas = await this.plateDataService.fetchPlateData(
      userId,
      dataFlag,
    );
    const titleDatas =
      user.platesetting.showChinghoIco === true ? user.usertitle : {};
    console.log(titleDatas);
  }
}
