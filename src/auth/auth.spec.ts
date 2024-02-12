import { AuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user/user.service";
import { users } from "@prisma/client";

describe("Auth Service",() => {
  let service: AuthService;
  let userService: UserService;
beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,UserService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });
  const username = "testuser123";
  const password = "testpass123";
  const ip = "123.123.123.123";
  const ua = "User-Agent Test Client X123 4563;uk-ua=0.89";
  let user:users;
  it("Should create user & user auth",async () => {
    user = await userService.create({username,password});
    await service.create({ip,ua,user_id:user.id});
    const wrongAuth = await service.getByIpUaUser({ip:ip.replace("3","4"),ua,user_id: user.id});
    const correctAuth = await service.getByIpUaUser({ip,ua,user_id:user.id});
    expect(wrongAuth).toBeNull();
    expect(correctAuth).not.toBeNull();
    expect(correctAuth.user_id).toBe(user.id);
  });
  it("Should retrieve all user sessions",async () => {
    expect(user).not.toBeNull();
    const auths = await service.getByUserId(user.id);
    expect(auths.length).toEqual(1);
  });
  it("Should update last_accessed_at property",async () => {
    const before = Date.now();
    expect(user).not.toBeNull();
    let auth = (await service.getByUserId(user.id))[0];
    await service.edit(auth.token);
    auth = await service.get(auth.token);
    expect(auth.last_accessed_at.getTime()).toBeGreaterThan(before);
  });
  it("Should delete auth",async () => {
    expect(user).not.toBeNull();
    const auth = (await service.getByUserId(user.id))[0];
    await service.delete(auth.token);
    const auths = await service.getByUserId(user.id);
    expect(auths.length).toBe(0);
  });
  it("Should create many auths",async () => {
    const amount = Math.floor(Math.random()*15);
    for(let i = 0; i < amount;i++) {
      await service.create({ip,ua,user_id:user.id});
    }
    const auths = await service.getByUserId(user.id);
    expect(auths.length).toBe(amount);
  });
  it("Should delete all auths on user deletion",async () => {
    await userService.delete(user.id);
    const auths = await service.getByUserId(user.id);
    expect(auths.length).toBe(0);
  });
});