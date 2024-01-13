import { Injectable } from "@nestjs/common";
import { compare, genSalt, hash } from "bcrypt";

@Injectable()
export class AppService{
  async encryptPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    const hashed = await hash(password, salt);
    return hashed;
  }
  async checkPassword(
    original: string,
    hashed: string
  ): Promise<boolean> {
    return await compare(original, hashed);
  }
}