import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import axios from "axios";
import qs from "qs";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
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

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params);
};

@Controller("auth")
export class AuthController {
  private steam: SteamAuth;

  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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
  async steamAuthenticate(@Req() req: Request) {
    const user: SteamUserObject = await this.steam.authenticate(req);
    return user._json.steamid;
  }

  @Get("steam/games/:id")
  async getGames(@Param("id") id: string) {
    this.logger.info(`GET - /auth/steam/games/${id}`);

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

  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    this.logger.info(`POST - /auth/login`);
    const tokens = await this.authService.login(loginDto);
    res
      .cookie("access_token", tokens.accessToken, { httpOnly: true })
      .cookie("refresh_token", tokens.refreshToken, { httpOnly: true })
      .status(200)
      .send();
  }

  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    this.logger.info(`POST - /auth/register`);
    return this.authService.register(registerDto);
  }

  @Post("logout")
  logout(@Res() res: Response) {
    this.logger.info(`POST - /auth/logout`);
    res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .status(200)
      .send();
  }
}
