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
import { cookieOptions } from "./cookie.options";

type Cookies = {
  access_token?: string;
  refresh_token?: string;
};
type Headers = {
  access_token?: string;
  refresh_token?: string;
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

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse() as Response;
    const cookies: Cookies = request.cookies as Cookies;
    const headers: Headers = request.headers as Headers;

    const notExistTokenAtCookies = !cookies.access_token || !cookies.refresh_token
    const notExistTokenAtHeaders = !headers.access_token || !headers.refresh_token
    
    if (notExistTokenAtCookies && notExistTokenAtHeaders) {
      if (!isPublic) throw new UnauthorizedException("Token not found");
    }

    try {
      if(cookies.access_token){
        cookies.access_token = cookies.access_token.replace("Bearer ", "");
        cookies.refresh_token = cookies.refresh_token.replace("Bearer ", "");
      }else {
        headers.access_token = headers.access_token.replace("Bearer ", "");
        headers.refresh_token = headers.refresh_token.replace("Bearer ", "");
      }
    } catch (err) {}

    try {
      const currentAccessToken = cookies.access_token ?? headers.access_token;

      const decodedAccessToken: TokenPayload =
        await this.tokenService.getTokenPayload(currentAccessToken);
      request.user = decodedAccessToken;
      return true;
    } catch (accessTokenError) {
      try {
        const currentRefreshToken = cookies.refresh_token ?? headers.refresh_token;

        const decodedRefreshToken: TokenPayload =
          await this.tokenService.getTokenPayload(currentRefreshToken);
        const newAccessToken = await this.tokenService.signAsync(
          decodedRefreshToken,
          process.env.ACCESS_TOKEN_EXPIRE,
        );
        request.user = decodedRefreshToken;
        response.cookie("access_token", newAccessToken, { ...cookieOptions});
        response.header("access_token", newAccessToken);
        return true;
      } catch (refreshTokenError) {
        if (isPublic) {
          request.user = null;
          return true;
        }
        // token expire 시 토큰 자체를 삭제.
        // access_token을 header로 보낼 경우 clearCookie 대신 clearHeader로 바꿔야할듯?
        response.clearCookie("access_token", { httpOnly: true });
        response.clearCookie("refresh_token", { httpOnly: true });
        throw new UnauthorizedException("Token expired");
      }
    }
  }
}
