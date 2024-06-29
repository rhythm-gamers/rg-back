import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { FirebaseService } from "src/firebase/firebase.service";
import { CodecService } from "src/codec/codec.service";
import { RtdbUpdateDto } from "src/firebase/dto/rtdb-update.dto";
import { User } from "../user/entity/user.entity";
import { Cron } from "@nestjs/schedule";

export interface UserChinghoProgress {
  current: number;
  max: number;
}

@Injectable()
export class ChinghoService implements OnModuleInit {
  private rareness;
  private title;

  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
    private readonly codecService: CodecService,
  ) {}

  async onModuleInit() {
    this.rareness = await this.firebaseService.get("chingho/database/c");
    this.title = await this.firebaseService.get("chingho/database/l");
  }

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

  async updateSteamgameChingho(userid: number) {
    const user = await this.userService.fetchWithUserId(userid);
    await this.uploadChinghoOnFirebase(user.id, user.steamId);
  }

  async fetchUserChinghoList(userid: number) {
    return await this.firebaseService.get(`chingho/${userid}`);
  }

  async fetchAllChingho() {
    // 칭호 리스트만 가져오면 된다. 어차피 프론트에서 보는 값은 미보유/보유기 때문
    return await this.firebaseService.get("chingho/database/c");
  }

  async fetchUserChinghoProgress(userid: number): Promise<UserChinghoProgress> {
    let progress = 0;
    const chinghoList = await this.fetchUserChinghoList(userid);
    Object.keys(chinghoList).forEach((category) => {
      switch (category) {
        case "레벨테스트":
          progress += Object.keys(chinghoList[category])
            .map(Number)
            .reduce((accumulator, currentnum) => accumulator + currentnum);
          break;
        case "스팀":
          Object.keys(chinghoList[category]).forEach((chinghoLevel) => {
            progress +=
              +chinghoLevel *
              Object.keys(chinghoList[category][chinghoLevel]).length;
          });
          break;
      }
    });
    return {
      current: progress,
      max: Object.keys(this.rareness).length * Object.keys(this.title).length,
    };
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
      await this.firebaseService.update(`chingho/${userid}/스팀`, result);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
