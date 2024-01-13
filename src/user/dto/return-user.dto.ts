import { Prisma, users } from "@prisma/client";
import { Exclude } from "class-transformer";

export class ReturnUserDto implements users {
  avatar: string;
  created_at: Date;
  display_name: string;
  id: string;
  preferences: Prisma.JsonValue;
  username: string;
  @Exclude()
  password: string;
}