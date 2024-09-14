/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Patch, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { UpdatePlateSettingDto } from "../dto/update-plate-setting.dto";
import { UpdatePlatedataDto } from "../dto/update-platedata.dto";
import { TokenPayload } from "src/auth/object/token-payload.obj";
import { HttpStatusCode } from "axios";
import { RPlateDataService } from "../service/rplate-data.service";
import { RPlateSettingService } from "../service/rplate-setting.service";

@Controller("plate")
export class PlateController {
  constructor(
    private readonly plateDataService: RPlateDataService,
    private readonly plateSettingService: RPlateSettingService,
  ) {}

  @Patch("setting")
  async updatePlateSetting(
    @Req() req,
    @Res() res: Response,
    @Body() dto: UpdatePlateSettingDto,
  ) {
    const user: TokenPayload = req.user;
    try {
      await this.plateSettingService.update(+user.uid, dto);
      res.status(HttpStatusCode.Ok).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  @Get("setting")
  async getPlateSetting(
    @Req() req,
    @Res() res: Response
  ) {
    const user: TokenPayload = req.user;
    try {
      const result = await this.plateSettingService.fetchByUserid(+user.uid);
      res.status(HttpStatusCode.Ok).send(result);
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  @Patch("data")
  async updatePlateData(
    @Req() req,
    @Res() res: Response,
    @Body() dto: UpdatePlatedataDto,
  ) {
    const user: TokenPayload = req.user;
    try {
      await this.plateDataService.update(+user.uid, dto);
      res.status(HttpStatusCode.Ok).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  @Get("data")
  async getUserPlateData(
    @Req() req,
    @Res() res: Response
  ) {
    const user: TokenPayload = req.user;
    try {
      const result = await this.plateDataService.fetchByUserid(+user.uid);
      res.status(HttpStatusCode.Ok).send(result);
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }
}
