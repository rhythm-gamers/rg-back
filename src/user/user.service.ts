import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async fetchUserWithUserID(userId: number): Promise<User> {
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
}
