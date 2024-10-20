/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Patch, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { TokenPayload } from "src/auth/object/token-payload.obj";
import { UpdateChinghoDto } from "../dto/update-chingho.dto";
import { ApiTags } from "@nestjs/swagger";
import { HttpStatusCode } from "axios";
import { RChinghoService } from "../service/rchingho.service";

@ApiTags("rchingho")
@Controller("v2/chingho")
export class ChinghoController {
  constructor(private readonly chinghoService: RChinghoService) {}

  @Get()
  async getAllChingho(@Req() req, @Res() res: Response) {
    const user: TokenPayload = req.user;
    try {
      const chinghoList = await this.chinghoService.fetchUserChinghoList(
        +user.uid,
      );
      res.status(HttpStatusCode.Ok).send(chinghoList);
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  @Get("current")
  async getCurrentChingho(@Req() req, @Res() res: Response) {
    const user: TokenPayload = req.user;
    try {
      const currentChingho = await this.chinghoService.fetchCurrentChingho(
        +user.uid,
      );
      console.log(currentChingho);
      res.status(HttpStatusCode.Ok).send(currentChingho);
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  @Patch()
  async updateChingho(
    @Req() req,
    @Res() res: Response,
    @Body() dto: UpdateChinghoDto,
  ) {
    console.log(dto);
    const user: TokenPayload = req.user;
    try {
      await this.chinghoService.updateUserChingho(+user.uid, dto);
      res.status(HttpStatusCode.Ok).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send(e.message);
    }
  }
}
