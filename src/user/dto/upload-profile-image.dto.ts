import { IsBase64, IsNotEmpty } from "class-validator";

export class UploadProfileImageDto {
  @IsBase64()
  image: string;
}
