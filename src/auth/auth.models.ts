export type AuthBase = {
  username:string,
  password:string,
}
export type AuthWithIP = AuthBase & {
  ip:string,
  ua:string
}