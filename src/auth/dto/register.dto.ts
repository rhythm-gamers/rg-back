import { IsString } from "class-validator";

export class RegisterDto {
  @IsString()
  nickname: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}
