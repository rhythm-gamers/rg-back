import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import axios, { HttpStatusCode } from "axios";
import qs from "qs";
import {
  // steam,
  SteamUserObject,
  rhythmGameList,
} from "./object/auth.object";
import SteamAuth from "node-steam-openid";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { SkipAuth } from "src/token/token.metadata";
import { TokenPayload } from "./object/token-payload.obj";
import { UserService } from "src/user/user.service";
import { CodecService } from "src/codec/codec.service";

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params);
};

@Controller("auth")
export class AuthController {
  private steam: SteamAuth;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly codecService: CodecService,
  ) {
    this.steam = new SteamAuth({
      realm: process.env.STEAM_REALM,
      returnUrl: process.env.STEAM_RETURN_URL,
      apiKey: process.env.STEAM_API_KEY,
    });
  }

  @Get("steam")
  async steamLogin(@Res() res: Response) {
    const redirectUrl = await this.steam.getRedirectUrl();
    res.redirect(redirectUrl);
  }

  @Get("steam/authenticate")
  async steamAuthenticate(@Req() req, @Res() res: Response) {
    const rgbackUser: TokenPayload = req.user;
    const user: SteamUserObject = await this.steam.authenticate(req);
    const steamid: string = user._json.steamid;

    const encrypted = await this.codecService.encrypt(steamid);

    await this.userService.saveUserSteamUID(+rgbackUser.uid, encrypted);
    res.redirect(process.env.AFTER_REDIRECT_URL);
    return;
  }

  @ApiOkResponse({
    description: "스팀 게임 목록 조회 완료",
    schema: {
      type: "array",
      items: {
        type: "string",
      },
      example: [
        "Djmax Respect V",
        "EZ2ON REBOOT",
        "불과 얼음의 춤 (A Dance of Fire and Ice)",
        "Rhythm Doctor",
      ],
    },
  })
  @ApiBadRequestResponse({
    description: "저장된 스팀 id 없음",
  })
  @Get("steam/games")
  async getGames(@Req() req, @Res() res: Response) {
    const token: TokenPayload = req.user;
    const user = await this.userService.fetchWithUserId(+token.uid);
    const steamid: string = user.steamId;
    if (steamid === "" || steamid == null) {
      res.status(HttpStatusCode.BadRequest).send();
      return;
    }

    const decrypted = await this.codecService.decrypt(steamid);

    const params = {
      key: process.env.STEAM_API_KEY,
      steamid: decrypted,
      format: "json",
      include_appinfo: true,
      appids_filter: rhythmGameList,
    };

    const games = await axios.get(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`,
      { params },
    );
    const gamesObj: Array<Record<string, string>> = games.data.response.games;

    const data = [];
    gamesObj.forEach((game) => {
      data.push(game.name);
    });

    res.status(HttpStatusCode.Ok).send(data);
    return;
  }

  @SkipAuth()
  @ApiTags("auth")
  @ApiOperation({ summary: "사용자 로그인" })
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(loginDto);
    res
      .cookie("access_token", tokens.accessToken, { httpOnly: true })
      .cookie("refresh_token", tokens.refreshToken, { httpOnly: true })
      .status(HttpStatusCode.Ok)
      .send();
  }

  @SkipAuth()
  @ApiTags("auth")
  @ApiOperation({ summary: "사용자 회원가입" })
  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiTags("auth")
  @ApiOperation({ summary: "사용자 로그아웃" })
  @Post("logout")
  logout(@Res() res: Response) {
    res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .status(HttpStatusCode.Ok)
      .send();
  }
}
