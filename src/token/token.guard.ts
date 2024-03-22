import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "./token.metadata";
import { TokenPayload } from "src/auth/object/token-payload.obj";

type Cookies = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse() as Response;
    const cookies: Cookies = request.cookies as Cookies;

    if (!cookies.access_token || !cookies.refresh_token) {
      throw new UnauthorizedException("Token not found");
    }

    cookies.access_token = cookies.access_token.replace("Bearer ", "");
    cookies.refresh_token = cookies.refresh_token.replace("Bearer ", "");

    const jwtSecret = process.env.JWT_SECRET;

    try {
      const decodedAccessToken = this.getPayload(
        cookies.access_token,
        jwtSecret,
      );
      request.user = decodedAccessToken;
      return true;
    } catch (accessTokenError) {
      try {
        const decodedRefreshToken: TokenPayload = this.getPayload(
          cookies.refresh_token,
          jwtSecret,
        );
        const newAccessToken: string = this.jwtService.sign(
          {
            ...decodedRefreshToken,
          },
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRE, secret: jwtSecret },
        );
        request.user = decodedRefreshToken;
        response.cookie("access_token", newAccessToken, { httpOnly: true });
        return true;
      } catch (refreshTokenError) {
        // token expire 시 토큰 자체를 삭제.
        // access_token을 header로 보낼 경우 clearCookie 대신 clearHeader로 바꿔야할듯?
        response.clearCookie("access_token", { httpOnly: true });
        response.clearCookie("refresh_token", { httpOnly: true });
        throw new UnauthorizedException("Token expired");
      }
    }
  }

  getPayload(token: string, secret: string): TokenPayload {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...payload } = this.jwtService.verify(token, {
      secret: secret,
    });
    return payload;
  }
}
