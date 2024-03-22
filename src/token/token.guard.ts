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
      const decodedAccessToken = this.jwtService.verify(cookies.access_token, {
        secret: jwtSecret,
      });
      console.log(decodedAccessToken);
      request.user = decodedAccessToken;
      return true;
    } catch (accessTokenError) {
      try {
        const decodedRefreshToken = this.jwtService.verify(
          cookies.refresh_token,
          {
            secret: jwtSecret,
          },
        );
        const newAccessToken = this.jwtService.sign(
          {
            uid: decodedRefreshToken.uid,
            username: decodedRefreshToken.username,
          },
          { expiresIn: "1h", secret: jwtSecret },
        );
        request.user = decodedRefreshToken;
        response.cookie("access_token", newAccessToken, { httpOnly: true });
        return true;
      } catch (refreshTokenError) {
        throw new UnauthorizedException("Token expired");
      }
    }
  }
}
