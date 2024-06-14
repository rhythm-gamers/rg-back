import { BadRequestException, Injectable } from "@nestjs/common";
import { UserTitle } from "../entity/user-title.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateUserTitleDto } from "../dto/update-user-title.dto";

@Injectable()
export class UserTitleService {
  constructor(
    @InjectRepository(UserTitle)
    private userTitleRepository: Repository<UserTitle>,
  ) {}

  async create() {
    const userTitle = await this.userTitleRepository.create();
    const res = await this.userTitleRepository.save(userTitle);
    return res;
  }

  async update(updateDto: UpdateUserTitleDto, userId: number) {
    const plate = await this.userTitleRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });
    try {
      await this.userTitleRepository.update(plate, updateDto);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchByNickname(nickname: string) {
    const plate = await this.userTitleRepository.findOne({
      where: {
        user: {
          nickname: nickname,
        },
      },
      relations: {
        user: true,
      },
    });
    if (plate == null) {
      throw new BadRequestException("User Not Found");
    }
    delete plate.user;
    delete plate.id;
    return plate;
  }

  async delete(userId: number) {
    await this.userTitleRepository.delete({
      user: {
        id: userId,
      },
    });
  }
}
