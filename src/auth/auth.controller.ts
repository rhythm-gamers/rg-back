import { Body, Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import axios from "axios";
import qs from "qs";
import {
  // steam,
  SteamUserObject,
  sixtarGateId,
  djMaxId,
  ez2onRebootRId,
  museDashId,
  rhythmDoctorId,
  adofaiId,
} from "./auth.object";
import SteamAuth from "node-steam-openid";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params);
};

@Controller("auth")
export class AuthController {
  private steam: SteamAuth;

  constructor(private readonly authService: AuthService) {
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
  async steamAuthenticate(@Req() req: Request) {
    const user: SteamUserObject = await this.steam.authenticate(req);
    return user._json.steamid;
  }

  @Get("steam/games/:id")
  async getGames(@Param("id") id: string) {
    const params = {
      key: process.env.STEAM_API_KEY,
      steamid: id,
      format: "json",
      include_appinfo: true,
      appids_filter: [
        sixtarGateId,
        djMaxId,
        ez2onRebootRId,
        museDashId,
        rhythmDoctorId,
        adofaiId,
      ],
    };

    const games = await axios.get(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`,
      { params },
    );

    return games.data;
  }

  @ApiTags("auth")
  @ApiOperation({ summary: "사용자 로그인" })
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(loginDto);
    res
      .cookie("access_token", tokens.accessToken, { httpOnly: true })
      .cookie("refresh_token", tokens.refreshToken, { httpOnly: true })
      .status(200)
      .send();
  }

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
      .status(200)
      .send();
  }
}
