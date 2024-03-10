import { IsString } from "class-validator";
import { LoginDto } from "./login.dto";
import { IntersectionType, ApiProperty } from "@nestjs/swagger";

export class RegisterDto extends IntersectionType(LoginDto) {
  @ApiProperty({ description: "유저 닉네임", example: "John Doe" })
  @IsString()
  nickname: string;
}
