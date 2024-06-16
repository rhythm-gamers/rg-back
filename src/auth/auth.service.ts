import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { UserTitleService } from "src/user/service/user-title.service";
import { PlateSettingService } from "src/user/service/plate-setting.service";
import { TokenPayload } from "./object/token-payload.obj";
import { PlateDataService } from "src/user/service/plate-data.service";
import { TokenService } from "src/token/token.service";

const SALT_ROUNDS = 10;
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userTitleService: UserTitleService,
    private readonly plateSettingService: PlateSettingService,
    private readonly plateDataService: PlateDataService,
    private readonly tokenService: TokenService,
  ) {}

  @InjectRepository(User) private readonly userRepository: Repository<User>;

  async login(loginDto: LoginDto) {
    const user = await this.findUserByUsername(loginDto);
    if (!user) throw new NotFoundException("User not found");

    if (bcrypt.compareSync(loginDto.password, user.password)) {
      const payload = new TokenPayload(user);
      let accessToken = await this.tokenService.signAsync(
        payload,
        process.env.ACCESS_TOKEN_EXPIRE,
      );
      let refreshToken = await this.tokenService.signAsync(
        payload,
        process.env.REFRESH_TOKEN_EXPIRE,
      );

      accessToken = "Bearer " + accessToken;
      refreshToken = "Bearer " + refreshToken;

      return { accessToken, refreshToken };
    } else throw new UnauthorizedException("Invalid password");
  }

  async register(registerDto: RegisterDto) {
    const results = await Promise.all([
      this.findUserByUsername(registerDto),
      this.checkDuplicateNickname(registerDto.nickname),
    ]);
    if (results[0]) throw new ConflictException("User already exists");

    const hashedPassword = this.hashPassword(registerDto.password);
    registerDto.password = hashedPassword;

    const newUser = await this.createUser(registerDto);
    delete newUser.password;
    return newUser;
  }

  private async findUserByUsername(loginDto: LoginDto) {
    return await this.userRepository.findOne({
      where: {
        registerId: loginDto.username,
      },
    });
  }

  private async checkDuplicateNickname(nickname: string) {
    const user = await this.userRepository.findOne({
      where: { nickname },
    });
    if (user) throw new ConflictException("Nickname already exists");
  }

  private hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    return bcrypt.hashSync(password, salt);
  }

  private async createUser(registerDto: RegisterDto) {
    const userTitle = await this.userTitleService.create();
    const plateSetting = await this.plateSettingService.create();
    const plateData = await this.plateDataService.create();
    const newUser = this.userRepository.create({
      registerId: registerDto.username,
      nickname: registerDto.nickname,
      password: registerDto.password,
      userTitle: userTitle,
      plateSetting: plateSetting,
      plateData: plateData,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }
}
