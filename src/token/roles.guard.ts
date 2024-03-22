import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role, TokenPayload } from "src/auth/object/token-payload.obj";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();
    const user: TokenPayload = req.user;

    // @Roles 데코레이터가 없을 때
    if (!roles) {
      return true;
    }
    // @Roles() 만 적힌 경우. 즉 결과값이 []인 경우
    if (!roles.length) {
      return true;
    }
    // @Roles(Role.Admin) 등과 같이 적힌 경우
    // Admin인 경우 무조건 통과
    if (user.role === Role.Admin) {
      return true;
    }
    // 해당 권한이 있다면 통과
    if (roles.includes(user.role) === true) {
      return true;
    }
    throw new ForbiddenException("접근 권한이 없습니다.");
  }
}
