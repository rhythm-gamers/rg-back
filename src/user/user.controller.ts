import { Body, Controller, Get, Param, Patch, Req, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdatePlateSettingDto } from "./dto/update-plate-setting.dto";
import { PlateSettingService } from "./service/plate-setting.service";
import { Response } from "express";
import { SkipAuth } from "src/token/token.metadata";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { UpdateUserTitleDto } from "./dto/update-user-title.dto";
import { UserTitleService } from "./service/user-title.service";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly plateSettingService: PlateSettingService,
    private readonly userTitleService: UserTitleService,
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
      res.status(200).send();
    } catch (error) {
      res.status(400).send();
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
      res.status(200).send();
    } catch (error) {
      res.status(400).send();
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
    res.status(200).send(plate);
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
    res.status(200).send(titles);
  }
}
