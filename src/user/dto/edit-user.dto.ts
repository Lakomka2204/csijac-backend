import { IsNotEmpty } from "class-validator";

export class EditUserDto {
  username?: string;
  display_name?: string;
  @IsNotEmpty()
  password?:string;
}