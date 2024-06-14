import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdatePlateSettingDto } from "./dto/update-plate-setting.dto";
import { PlateSettingService } from "./service/plate-setting.service";
import { Response } from "express";
import { SkipAuth } from "src/token/token.metadata";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { UpdateUserTitleDto } from "./dto/update-user-title.dto";
import { UserTitleService } from "./service/user-title.service";
import { TokenPayload } from "src/auth/object/token-payload.obj";
import { UploadProfileImageDto } from "./dto/upload-profile-image.dto";
import { UpdateIntroductionDto } from "./dto/update-introduction.dto";
import axios, { HttpStatusCode } from "axios";
import { rhythmGameList } from "../auth/object/auth.object";
import { CodecService } from "src/codec/codec.service";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly plateSettingService: PlateSettingService,
    private readonly userTitleService: UserTitleService,
    private readonly codecService: CodecService,
  ) {}

  @ApiTags("User Setting")
  @Patch("plate-setting")
  async UpdatePlateSetting(
    @Body() updateDto: UpdatePlateSettingDto,
    @Res() res: Response,
    @Req() req,
  ) {
    try {
      const user = req.user;
      await this.plateSettingService.update(updateDto, user.uid);
      res.status(HttpStatusCode.Ok).send();
    } catch (error) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  @ApiTags("User Setting")
  @Patch("user-title")
  async UpdateUserTitle(
    @Body() updateDto: UpdateUserTitleDto,
    @Res() res: Response,
    @Req() req,
  ) {
    try {
      const user = req.user;
      await this.userTitleService.update(updateDto, user.uid);
      res.status(HttpStatusCode.Ok).send();
    } catch (error) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  @SkipAuth()
  @ApiTags("User Setting")
  @Get("plate-setting/:nickname")
  @ApiParam({
    required: true,
    example: "John Doe",
    name: "nickname",
  })
  async getUserPlateSetting(
    @Param("nickname") nickname: string,
    @Res() res: Response,
  ) {
    const plate = await this.plateSettingService.fetchByNickname(nickname);
    res.status(HttpStatusCode.Ok).send(plate);
  }

  @SkipAuth()
  @ApiTags("User Setting")
  @Get("user-title/:nickname") // nickname으로 받아올 것인가?
  @ApiParam({
    required: true,
    example: "John Doe",
    name: "nickname",
  })
  async getUserTitle(
    @Param("nickname") nickname: string,
    @Res() res: Response,
  ) {
    const titles = await this.userTitleService.fetchByNickname(nickname);
    res.status(HttpStatusCode.Ok).send(titles);
  }

  @ApiTags("User Setting")
  @Post("upload/profile-image")
  async uploadProfileImage(
    @Req() req,
    @Res() res: Response,
    @Body() profileImageDto: UploadProfileImageDto,
  ) {
    const user: TokenPayload = req.user;
    const imageBase64: string = profileImageDto.image;
    this.userService.uploadUserProfileImage(user.nickname, imageBase64);
    res.status(HttpStatusCode.Ok).send();
  }

  @SkipAuth()
  @ApiTags("User Setting")
  @Get("plate/:nickname")
  async fetchUserPlateData(
    @Req() req,
    @Res() res: Response,
    @Param("nickname") nickname: string,
  ) {
    await this.userService.fetchPlateDataByNickname(nickname);
    res.send();
  }

  @ApiBody({
    schema: {
      type: "object",
      properties: {
        introduction: {
          type: "string",
          example: "rgback admin입니다.",
          description: "업데이트 될 한줄 소개",
        },
      },
    },
  })
  @ApiOkResponse({
    description: "가져오기 성공",
  })
  @ApiTags("User Setting")
  @Get("introduction")
  async fetchIntroduction(@Req() req, @Res() res: Response) {
    const user: TokenPayload = req.user;
    const introduction = await this.userService.fetchIntroduction(+user.uid);
    res.status(HttpStatusCode.Ok).send({ introduction: introduction });
  }

  @ApiBody({
    schema: {
      type: "object",
      properties: {
        introduction: {
          type: "string",
          example: "rgback admin입니다.",
          description: "업데이트 될 한줄 소개",
        },
      },
    },
  })
  @ApiOkResponse({
    description: "업데이트 성공",
  })
  @ApiBadRequestResponse({
    description: "토큰 없음",
  })
  @ApiInternalServerErrorResponse({
    description: "데이터베이스 오류",
  })
  @ApiTags("User Setting")
  @Post("introduction")
  async changeIntroduction(
    @Body() updateDto: UpdateIntroductionDto,
    @Req() req,
    @Res() res: Response,
  ) {
    const user: TokenPayload = req.user;
    const introduction: string = updateDto.introduction;
    if (introduction.length > 200) {
      res.status(HttpStatusCode.BadRequest).send();
    }
    const result = await this.userService.updateIntroduction(
      +user.uid,
      introduction,
    );
    console.log(result);
    if (result) {
      res.status(HttpStatusCode.Ok).send();
    } else {
      res.status(HttpStatusCode.InternalServerError).send();
    }
  }

  @ApiTags("steam-games")
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
}
