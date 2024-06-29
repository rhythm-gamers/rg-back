import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { HttpStatusCode } from "axios";
import { CodecService } from "src/codec/codec.service";
import { UpdateNicknameDto } from "./dto/update-nickname.dto";
import { ChinghoService } from "../chingho/chingho.service";
import { UpdateChinghoDto } from "./dto/update-chingho.dto";
import { PlateDataService } from "./service/plate-data.service";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly plateSettingService: PlateSettingService,
    private readonly userTitleService: UserTitleService,
    private readonly codecService: CodecService,
    private readonly chinghoService: ChinghoService,
    private readonly plateDataService: PlateDataService,
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

  /*
    이 부분은 프론트에서 S3 경로 환경변수화 하고
    profile-image/<nickname>으로 바로 접근해서 fetch할 수 있도록 하는게 좋을듯?
  */
  @ApiTags("User Setting")
  @Get("profile-image")
  async fetchProfileImagePath(@Req() req, @Res() res: Response) {
    const user: TokenPayload = req.user;
    const imagePath = this.userService.fetchUserProfileImage(user.nickname);
    res.status(HttpStatusCode.Ok).send(imagePath);
  }

  @SkipAuth()
  @ApiTags("User Setting")
  @Get("plate/:nickname")
  async fetchUserPlateData(
    @Req() req,
    @Res() res: Response,
    @Param("nickname") nickname: string,
  ) {
    await this.userService.fetchPlatedataByNickname(nickname);
    res.send();
  }

  @ApiTags("User Setting")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        nickname: {
          type: "string",
          example: "John Doe 3",
          description: "닉네임 변경",
        },
      },
    },
  })
  @ApiOkResponse({
    description: "변경 성공",
  })
  @ApiBadRequestResponse({
    description: "중복된 닉네임 존재",
  })
  @Patch("nickname")
  async updateNickname(
    @Req() req,
    @Res() res: Response,
    @Body() { nickname }: UpdateNicknameDto,
  ) {
    let payload = req.user;
    try {
      await this.userService.updateNickname(payload.uid, nickname);
      payload = { ...payload, nickname };
      res.send();
    } catch (err) {
      res.status(HttpStatusCode.BadRequest).send("사용중인 닉네임");
    }
    return;
  }

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

  /*
  // 스팀 게임 조회는 스팀 연동시, 칭호 업데이트 cron시 가져옴
  // 즉, 보유 게임 목록을 조회하는 엔드포인트 필요 없어짐
  @ApiTags("steam-games")
  @ApiOkResponse({
    description: "스팀 게임 목록 조회 완료",
    schema: {
      type: "array",
      items: {
        type: "object",
      },
      example: [
        {
          name: "Djmax Respect V",
          playtime: "100000",
        },
        {
          name: "EZ2ON REBOOT",
          playtime: "100000",
        },
        {
          name: "불과 얼음의 춤 (A Dance of Fire and Ice)",
          playtime: "100000",
        },
        {
          name: "Rhythm Doctor",
          playtime: "100000",
        },
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

    const decryptedSteamId = await this.codecService.decrypt(steamid);
    const data = await this.userService.getUserSteamgameList(decryptedSteamId);

    res.status(HttpStatusCode.Ok).send(data);
    return;
  }
  */

  @ApiTags("칭호")
  @Put("chingho")
  @ApiBadRequestResponse({
    description: "잘못된 입력값",
  })
  @ApiOkResponse({
    description: "업데이트 성공",
  })
  async updateChingho(
    @Body() dto: UpdateChinghoDto,
    @Req() req,
    @Res() res: Response,
  ) {
    const token: TokenPayload = req.user;
    await this.plateDataService.update(+token.uid, dto);
    res.send();
  }

  @ApiTags("칭호")
  @Get("current-chingho")
  async getCurrentChingho(@Req() req, @Res() res: Response) {
    const token: TokenPayload = req.user;
    const chingho = await this.plateDataService.fetchCurrentChingho(+token.uid);
    res.send(chingho);
  }

  @ApiTags("칭호")
  @Get("all-chingho")
  async getAllChingho(@Req() req, @Res() res: Response) {
    const token = req.user;
    const chinghoProgress = await this.chinghoService.fetchUserChinghoProgress(
      +token.uid,
    );
    const havingChingho = await this.chinghoService.fetchUserChinghoList(
      +token.uid,
    );
    const allChingho = await this.chinghoService.fetchAllChingho();
    res.send({
      progress: chinghoProgress,
      havingChingho: havingChingho,
      allChingho: allChingho,
    });
  }

  @Get("test")
  async testing(@Req() req, @Res() res: Response) {
    const token = req.user;
    res.send();
  }
}
