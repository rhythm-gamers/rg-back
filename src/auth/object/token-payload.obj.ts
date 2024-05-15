import { User } from "src/user/entity/user.entity";

export class TokenPayload {
  uid: number;
  registerId: string; // username을 registerId로 변경
  nickname: string;
  role: Role;

  constructor(user: User) {
    this.uid = user.id;
    this.registerId = user.registerId;
    this.nickname = user.nickname;
    this.role = user.adminYn === true ? Role.Admin : Role.User;
  }
}

export enum Role {
  User = "User",
  Admin = "Admin",
}
