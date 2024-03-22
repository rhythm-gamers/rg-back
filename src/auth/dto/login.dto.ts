import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "유저 아이디", example: "johndoe" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: "유저 비밀번호", example: "password" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
