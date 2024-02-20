import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const __CONSOLE = true;
const __LOG_SAVE = false;

const loggerLevel = 'silly';

const loggerFormatter = (isConsole: boolean) => {
  return winston.format.combine(
    isConsole === true ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    nestWinstonModuleUtilities.format.nestLike('MyApp', {
      prettyPrint: false,
    }),
  );
}

const loggerSetting = (isConsole: boolean) => {
  return {
    level: loggerLevel,
    format: loggerFormatter(isConsole),
  };
}

export const loggerConfig = {
  transports: [
    new winston.transports.Console(
      loggerSetting(__CONSOLE)
    ),
    new DailyRotateFile({
      filename: 'logs/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      // maxFiles: '14d',
      ...loggerSetting(__LOG_SAVE)
    }),
  ],
};
