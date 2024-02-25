import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Response } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

class ExampleLoggerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  age?: number;
}

@Controller("example-logger")
export class ExampleLoggerController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private createLogText(req: Request, dto?: ExampleLoggerDto): string {
    let logText = `${req.method} - ${req.url}`;
    if (dto) {
      logText = `${logText}, ${JSON.stringify(dto)}`;
    }
    return logText;
  }

  @Get("info")
  async exampleInfo_Get(@Req() req: Request, @Res() res: Response) {
    const logText = this.createLogText(req);
    this.logger.info(logText);
    res.status(HttpStatus.OK).send(logText);
  }

  @Post("info")
  async exampleInfo_Post(
    @Body() dto: ExampleLoggerDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const logText = this.createLogText(req, dto);
    this.logger.info(logText);
    res.status(HttpStatus.OK).send(logText);
  }

  @Get("warn")
  async exampleWarn_Get(@Req() req: Request, @Res() res: Response) {
    const logText = this.createLogText(req);
    this.logger.info(logText);
    res.status(HttpStatus.OK).send(logText);
  }

  @Post("warn")
  async exampleWarn_Post(
    @Body() dto: ExampleLoggerDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const logText = this.createLogText(req, dto);
    this.logger.info(logText);
    res.status(HttpStatus.OK).send(logText);
  }

  @Get("error")
  async exampleError_Get(@Req() req: Request, @Res() res: Response) {
    const logText = this.createLogText(req);
    this.logger.info(logText);
    res.status(HttpStatus.OK).send(logText);
  }

  @Post("error")
  async exampleError_Post(
    @Body() dto: ExampleLoggerDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const logText = this.createLogText(req, dto);
    this.logger.info(logText);
    res.status(HttpStatus.OK).send(logText);
  }
}
