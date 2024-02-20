import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import SteamAuth from "node-steam-openid";
import axios from "axios";
import qs from "qs";

const steam = new SteamAuth({
  realm: process.env.STEAM_REALM,
  returnUrl: process.env.STEAM_RETURN_URL,
  apiKey: process.env.STEAM_API_KEY,
});

const museDashId = 774171;
const rhythmDoctorId = 774181;
const djMaxId = 960170;
const adofaiId = 977950;
const ez2onRebootRId = 1477590;
const sixtarGateId = 1802720;

type UserObject = {
  _json: Record<string, any>;
  steamid: string;
  username: string;
  name: string;
  profile: string;
  avatar: {
    small: string;
    medium: string;
    large: string;
  };
};

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params);
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("steam")
  async steamLogin(@Res() res: Response) {
    const redirectUrl = await steam.getRedirectUrl();
    res.redirect(redirectUrl);
  }

  @Get("steam/authenticate")
  async steamAuthenticate(@Req() req: Request) {
    const user: UserObject = await steam.authenticate(req);
    return user;
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
}
