import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly jwt: JwtService,
  ) {}
  use(req: any, res: any, next: (error?: any) => void) {
    const { ip, method, originalUrl, headers } = req;
    const userAgent = req.get('user-agent');
    const payload = headers.authorization
      ? this.jwt.decode(headers.authorization)
      : null;
    const userId = payload ? payload.sub : 0;
    const datetime = this.makeTimestamp();
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `${datetime} User-${userId} ${method} ${originalUrl} ResCode-${statusCode} Ip-${ip} Agent-${userAgent}`,
      );
    });

    next();
  }

  private makeTimestamp() {
    return new Date()
      .toISOString()
      .split(/T/)[1] // [0]: YYYY-MM-DD, [1]: HH:mm:ss
      .replace(/\..+/, '');
  }
}
