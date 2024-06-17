import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenPayload } from "src/auth/object/token-payload.obj";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  private JWT_SECRET = process.env.JWT_SECRET;

  async generateJwtTokenAppendBearer(payload: object, expire: string | number) {
    const token = await this.signAsync(payload, expire);
    return `Bearer ${token}`;
  }

  async getTokenPayload(token: string): Promise<TokenPayload> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...payload } = await this.verifyAsync(token);
    return payload;
  }

  sign(payload: object, expire: string | number) {
    return this.jwtService.sign(
      {
        ...payload,
      },
      {
        expiresIn: expire,
      },
    );
  }

  async signAsync(payload: object, expire: string | number) {
    return await this.jwtService.signAsync(
      {
        ...payload,
      },
      {
        expiresIn: expire,
      },
    );
  }

  verify(token) {
    return this.jwtService.verify(token, { secret: this.JWT_SECRET });
  }

  async verifyAsync(token) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.JWT_SECRET,
    });
  }

  removeBearerPhrase = (token: string) => token.slice(7);
}
