import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { TokenPayload } from "./object/token-payload.obj";
import { TokenService } from "src/token/token.service";
import { RUserService } from "src/user/service/ruser.service";

const SALT_ROUNDS = 10;
@Injectable()
export class RAuthService {
  constructor(
    private readonly userService: RUserService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.fetchByRegisterId(loginDto.username);
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
      this.userService.isDuplicatedRegisterId(registerDto.username),
      this.userService.isDuplicatedNickname(registerDto.nickname),
    ]);
    if (results[0] || results[1])
      throw new ConflictException("User already exists");

    const hashedPassword = this.hashPassword(registerDto.password);
    registerDto.password = hashedPassword;

    // const newUser = await this.createUser(registerDto);
    const newUser = await this.userService.create(registerDto);
    delete newUser.password;
    return newUser;
  }

  private hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    return bcrypt.hashSync(password, salt);
  }
}
