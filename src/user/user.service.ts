import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async fetchUserWithUserID(user_id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({
      user_id: user_id,
    });
    return user;
  }

  async fetchUserDetailsWithUserID(user_id: number) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: user_id,
      },
      relations: {
        comment_like_list: {
          comment: true,
        },
        post_like_list: {
          post: true,
        },
      },
    });
    return user;
  }
}
