/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, HttpStatus, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { HttpStatusCode } from "axios";
import { Response } from "express";
import { TokenPayload } from "src/auth/object/token-payload.obj";
import { RUserService } from "../service/ruser.service";
import { UpdateNicknameDto } from "../dto/update-nickname.dto";
import { UpdateIntroductionDto } from "../dto/update-introduction.dto";

const NICKNAME_VALIDATOR_ARRAY = ["{nickname}", ",", undefined, null];

@ApiTags("ruser")
@Controller("v2/user")
export class RUserController {
  constructor(
    private readonly userService: RUserService,
  ) {}

  @Get("games")
  async getHavingGames(
    @Req() req,
    @Res() res: Response,
  ) {
    const user: TokenPayload = req.user;
    try {
      const gamelist = await this.userService.fetchHavingGames(+user.uid);
      res.status(HttpStatusCode.Ok).send(gamelist);
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  @Post("image")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfileImage(
    @Req() req,
    @Res() res: Response,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      res.send(HttpStatusCode.BadRequest).send();
      return;
    }

    const user: TokenPayload = req.user;
    try {
      await this.userService.updateProfileImage(+user.uid, image);
      res.status(HttpStatusCode.Ok).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  @Get("image")
  async getProfileImage(
    @Req() req,
    @Res() res: Response,
  ) {
    const user: TokenPayload = req.user;
    try {
      const imagePath = await this.userService.fetchProfileImage(+user.uid);
      res.status(HttpStatusCode.Ok).send(imagePath);
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  @Patch("nickname")
  async updateNickname(
    @Req() req,
    @Res() res: Response,
    @Body() dto: UpdateNicknameDto,
  ) {
    const user: TokenPayload = req.user;
    if (dto.nickname === user.nickname) res.status(HttpStatusCode.NotModified).send();
    try {
      await this.userService.updateNickname(+user.uid, dto);
      res.status(HttpStatusCode.Ok).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  @Get("introduction")
  async getIntroduction(
    @Req() req,
    @Res() res: Response,
  ) {
    const user: TokenPayload = req.user;
    try {
      const introduction = await this.userService.fetchIntroduction(+user.uid);
      res.status(HttpStatusCode.Ok).send(introduction);
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  @Patch("introduction")
  async updateIntroduction(
    @Req() req,
    @Res() res: Response,
    @Body() dto: UpdateIntroductionDto,
  ) {
    const user: TokenPayload = req.user;
    try {
      await this.userService.updateIntroduction(+user.uid, dto);
      res.status(HttpStatusCode.Ok).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }
}
