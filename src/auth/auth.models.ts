import { users } from "@prisma/client";
type AuthBase = {
  username:string,
  password:string,
}
type AuthWithIP = AuthBase & {
  ip:string,
  ua:string
}
export {users as User, AuthWithIP, AuthBase };