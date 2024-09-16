import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import axios, { HttpStatusCode } from "axios";
import qs from "qs";
import { SteamUserObject } from "./object/auth.object";
import SteamAuth from "node-steam-openid";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { SkipAuth } from "src/token/token.metadata";
import { TokenPayload } from "./object/token-payload.obj";
import { CodecService } from "src/codec/codec.service";
import { cookieOptions } from "src/token/cookie.options";
import { RUserService } from "src/user/service/ruser.service";
import { RChinghoService } from "src/chingho/service/rchingho.service";

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params);
};

@Controller("rauth")
export class RAuthController {
  private steam: SteamAuth;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: RUserService,
    private readonly codecService: CodecService,
    private readonly chinghoService: RChinghoService,
  ) {
    this.steam = new SteamAuth({
      realm: process.env.STEAM_REALM,
      returnUrl: process.env.STEAM_RETURN_URL,
      apiKey: process.env.STEAM_API_KEY,
    });
  }

  @ApiTags("rsteam")
  @Get("steam")
  async steamLogin(@Res() res: Response) {
    const redirectUrl = await this.steam.getRedirectUrl();
    res.redirect(redirectUrl);
  }

  @ApiTags("rsteam")
  @Get("steam/authenticate")
  async steamAuthenticate(@Req() req, @Res() res: Response) {
    const rgbackUser: TokenPayload = req.user;
    const user: SteamUserObject = await this.steam.authenticate(req);
    const steamid: string = user._json.steamid;

    const encrypted = await this.codecService.encrypt(steamid);

    await this.userService.saveUserSteamUID(+rgbackUser.uid, encrypted);
    /*
     스팀 로그인 시 바로 보유중인 게임 조회 및 칭호 설정
    */
    await this.chinghoService.updateSteamgameChingho(rgbackUser.uid);
    res.redirect(process.env.AFTER_REDIRECT_URL);
    return;
  }

  /*
    SteamGame 목록 조회하는 코드는 user.controller로 이동
  */

  @SkipAuth()
  @ApiTags("rauth")
  @ApiOperation({ summary: "사용자 로그인" })
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(loginDto);
    res
      .cookie("access_token", tokens.accessToken, { ...cookieOptions })
      .cookie("refresh_token", tokens.refreshToken, { ...cookieOptions })
      .setHeader("access_token", tokens.accessToken)
      .setHeader("refresh_token", tokens.refreshToken)
      .status(HttpStatusCode.Ok)
      .send();
  }

  @SkipAuth()
  @ApiTags("rauth")
  @ApiOperation({ summary: "사용자 회원가입" })
  @Post("register")
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      await this.authService.register(registerDto);
      res.status(HttpStatusCode.Ok).send();
    } catch (err) {
      res.status(err.status).send(err.message);
      return;
    }
    return;
  }

  @ApiTags("rauth")
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
