import { Injectable } from "@nestjs/common";
import crypto from "crypto";

@Injectable()
export class CodecService {
  private key: Buffer;
  constructor() {
    this.key = crypto.scryptSync(
      process.env.ENCRYPT_PASSWORD,
      process.env.ENCRYPT_SALT,
      32,
    );
  }

  async encrypt(data: string) {
    const cipher = crypto.createCipheriv(
      process.env.ENCRYPT_TYPE,
      this.key,
      null,
    );
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }

  async decrypt(data: string) {
    const decipher = crypto.createDecipheriv(
      process.env.ENCRYPT_TYPE,
      this.key,
      null,
    );
    let decrypted = decipher.update(data, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
