import { Prisma, auth } from "@prisma/client";
import { Exclude } from "class-transformer";

export class ReturnAuthDto implements auth {
  additional_info: Prisma.JsonValue;
  created_at: Date;
  ip: string;
  last_accessed_at: Date;
  @Exclude()
  token: string;
  @Exclude()
  ua: string;
  @Exclude()
  user_id: string;
  current:boolean;
}