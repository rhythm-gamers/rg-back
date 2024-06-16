import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Response } from "express";
import { IS_PUBLIC_KEY } from "./token.metadata";
import { TokenPayload } from "src/auth/object/token-payload.obj";
import { TokenService } from "./token.service";

type Cookies = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    try {
      const decodedAccessToken: TokenPayload =
        await this.tokenService.getTokenPayload(cookies.access_token);
      request.user = decodedAccessToken;
      return true;
    } catch (accessTokenError) {
      try {
        const decodedRefreshToken: TokenPayload =
          await this.tokenService.getTokenPayload(cookies.refresh_token);
        const newAccessToken = await this.tokenService.signAsync(
          decodedRefreshToken,
          process.env.ACCESS_TOKEN_EXPIRE,
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
}
