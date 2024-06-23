import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { FirebaseService } from "src/firebase/firebase.service";
import { CodecService } from "src/codec/codec.service";
import { RtdbUpdateDto } from "src/firebase/dto/rtdb-update.dto";
import { User } from "../user/entity/user.entity";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class ChinghoService {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
    private readonly codecService: CodecService,
  ) {}

  @Cron("0 0 */12 * * *", {
    name: "Update Steamgame Chingho",
    timeZone: "Asia/Seoul",
  })
  async updateChinghoCron() {
    const users: User[] = await this.userService.fetchAllWithExistSteamId();
    users.forEach(async (user) => {
      try {
        await this.codecService.decrypt(user.steamId);
        this.uploadChinghoOnFirebase(user.id, user.steamId);
      } catch (err) {}
    });
  }

  async updateSteamgameChingho(userId: number) {
    const user = await this.userService.fetchWithUserId(userId);
    await this.uploadChinghoOnFirebase(user.id, user.steamId);
  }

  private async uploadChinghoOnFirebase(userid, steamid) {
    steamid = await this.codecService.decrypt(steamid);
    let gamelist: Record<string, string | number>[];
    try {
      gamelist = await this.userService.getUserSteamgameList(steamid);
    } catch (err) {
      throw new BadRequestException(err);
    }

    const result: RtdbUpdateDto = {
      1: {},
      2: {},
      3: {},
      4: {},
    };
    gamelist.forEach((game) => {
      const playtime = +game.playtime / 60;
      if (playtime > 100) {
        result[4][game.appid] = playtime;
      } else if (playtime > 50) {
        result[3][game.appid] = `${playtime}/100`;
      } else if (playtime > 10) {
        result[2][game.appid] = `${playtime}/50`;
      } else {
        result[1][game.appid] = `${playtime}/10`;
      }
    });
    try {
      await this.firebaseService.update(`chingho/${userid}`, result);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
