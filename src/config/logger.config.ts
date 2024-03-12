import * as winston from "winston";
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from "nest-winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = __dirname + "/../../logs";
const isDevelope = process.env.IS_DEVELOPE === "dev";

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: "YYYY-MM-DD",
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    zippedArchive: true, // 로그를 분석할 일은 거의 없다. 압축해서 저장
    maxSize: "20m",
  };
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: isDevelope ? "silly" : "info",
      format: isDevelope
        ? winston.format.combine(
            winston.format.timestamp({ format: "YYYY-MM-DD" }),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike("RGBack", {
              colors: true,
              prettyPrint: true,
            }),
          )
        : winston.format.simple(),
    }),
    new DailyRotateFile(dailyOptions("info")),
    new DailyRotateFile(dailyOptions("warn")),
    new DailyRotateFile(dailyOptions("error")),
  ],
});
