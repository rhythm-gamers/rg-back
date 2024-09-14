/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AwsS3Service } from "src/s3/aws-s3.service";
import { UpdateNicknameDto } from "../dto/update-nickname.dto";
import { UpdateIntroductionDto } from "../dto/update-introduction.dto";
import { FirebaseService } from "src/firebase/firebase.service";
import { RegisterDto } from "src/auth/dto/register.dto";
import { RPlateDataService } from "src/plate/service/rplate-data.service";
import { RChinghoService } from "src/chingho/service/rchingho.service";
import { RUser } from "../entity/ruser.entity";
import { RPlateSettingService } from "src/plate/service/rplate-setting.service";

@Injectable()
export class RUserService {
  constructor(
    @InjectRepository(RUser)
    private readonly userRepo: Repository<RUser>,
    private readonly s3Service: AwsS3Service,
    private readonly firebaseService: FirebaseService,
    private readonly plateSettingService: RPlateSettingService,
    private readonly plateDataService: RPlateDataService,
    private readonly chinghoService: RChinghoService,
    
  ) {}

  private readonly PROFILE_IMAGE_PATH: string = "profile-image";
  private readonly EC2_BUCKET_PATH: string = process.env.AWS_S3_BUCKER_URL;

  async fetchByUserid(userid: number) {
    return await this.userRepo.findOneBy({ id: userid });
  }

  async fetchByRegisterId(registerId: string) {
    return await this.userRepo.findOneBy({ registerId: registerId });
  }

  async fetchHavingGames(userid: number) {
    const chinghos = await this.firebaseService.get(`chingho/${userid}/스팀`);
    const datas = await this.firebaseService.get(`chingho/database/c`);
    const result = [];
    try {
      Object.keys(chinghos).forEach((key) => {
        Object.keys(chinghos[key]).forEach(game => {
          result.push(datas[game]);
        })
      });
    } catch (e) {}
    return result;
  }

  async updateProfileImage(userid: number, image: Express.Multer.File) {
    try {
      const mime = await this.validateImage(image.buffer);
      await this.s3Service.upload(
        `${this.PROFILE_IMAGE_PATH}/${userid}`,
        image.buffer,
        mime,
      );
      await this.userRepo.update(
        { id: userid },
        { profileImage: `${this.EC2_BUCKET_PATH}/${this.PROFILE_IMAGE_PATH}/${userid}` }
      );
    } catch (e) {
      throw new Error(e.message);
    }
  }

  private async validateImage(image: Buffer): Promise<string> {
    // https://github.com/sindresorhus/file-type/issues/661
    const fileTypeFromBuffer = await eval('import("file-type")');
    const filetype = await fileTypeFromBuffer(image);
    if (!filetype.mime.startsWith("image")) throw new Error("맞지 않는 이미지 타입");
    return filetype.mime;
  }

  async fetchProfileImage(userid: number): Promise<string> {
    const imagePath = await this.userRepo.findOne({
      select: {
        id: true,
        profileImage: true,
      },
      where: { id: userid },
    });
    if (!imagePath) throw new Error("해당 유저 없음");
    return imagePath.profileImage;
  }

  async updateNickname(userid: number, dto: UpdateNicknameDto) {
    try {
      await this.userRepo.update(
        { id: userid },
        { nickname: dto.nickname },
      );
    } catch (e) {
      throw new Error("변경 실패");
    }
  }

  async fetchIntroduction(userid: number): Promise<string> {
    const user = await this.userRepo.findOne({
      select: {
        id: true,
        introduction: true,
      },
      where: { id: userid },
    });
    if (!user) throw new Error("존재하지 않는 유저");
    return user.introduction;
  }

  async updateIntroduction(userid: number, dto: UpdateIntroductionDto) {
    try {
      await this.userRepo.update(
        { id: userid },
        { introduction: dto.introduction },
      );
    } catch (e) {
      throw new Error("존재하지 않는 유저");
    }
  }

  async isDuplicatedNickname(nickname: string): Promise<boolean> {
    const user = await this.userRepo.findOneBy({nickname: nickname});
    return user ? true : false;
  }

  async isDuplicatedRegisterId(registreId: string): Promise<boolean> {
    const user = await this.userRepo.findOneBy({registerId: registreId});
    return user ? true : false;
  }

  async create(registerDto: RegisterDto) {
    let newUser = this.userRepo.create({
      registerId: registerDto.username,
      nickname: registerDto.nickname,
      password: registerDto.password,
    });
    newUser = await this.userRepo.save(newUser);
    newUser.plateSetting = await this.plateSettingService.create(newUser);
    newUser.plateData = await this.plateDataService.create(newUser);
    newUser.chingho = await this.chinghoService.create(newUser, newUser.plateData);
    
    try {
      return await this.userRepo.save(newUser);
    } catch (e) {
      console.log(e);
    }
  }
}
