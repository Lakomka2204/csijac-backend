import { GetAuthDto } from "./get-auth.dto";

export class CreateAuthDto extends GetAuthDto {
  user_id: string;
}