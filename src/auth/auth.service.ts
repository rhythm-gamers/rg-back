import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { UserTitleService } from "src/user/service/user-title.service";
import { PlateSettingService } from "src/user/service/plate-setting.service";

const SALT_ROUNDS = 10;
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private userTitleService: UserTitleService,
    private plateSettingService: PlateSettingService,
  ) {}

  @InjectRepository(User) private readonly userRepository: Repository<User>;

  async login(loginDto: LoginDto) {
    const user = await this.findUserByUsername(loginDto);
    if (!user) throw new NotFoundException("User not found");

    if (bcrypt.compareSync(loginDto.password, user.password)) {
      let accessToken = await this.jwtService.signAsync(
        {
          uid: user.userId,
          username: user.registerId,
        },
        { expiresIn: "1h" },
      );
      let refreshToken = await this.jwtService.signAsync(
        {
          uid: user.userId,
          username: user.registerId,
        },
        { expiresIn: "7d" },
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
    const newUser = this.userRepository.create({
      registerId: registerDto.username,
      nickname: registerDto.nickname,
      password: registerDto.password,
      usertitle: userTitle,
      platesetting: plateSetting,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }
}
