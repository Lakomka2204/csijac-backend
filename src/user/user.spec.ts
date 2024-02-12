import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { users } from "@prisma/client";
import { AuthService } from "../auth/auth.service";

describe("User Service",() => {
  let service: UserService;
  let authService: AuthService;
beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,AuthService],
    }).compile();

    service = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });
  const username = "111testuser123";
  const password = "111testpass123";
  let user:users;
  it("Should create user",async () => {
    user = await service.create({username,password});
    const getUser = await service.get(user.id);
    expect(getUser).not.toBeNull();
  });
  it("Should not create duplicate user",async () => {
    expect(user).not.toBeNull();
    await expect(service.create({username,password:password.replace("3","4")})).rejects.toThrow();
  })
  it("Should edit user",async () => {
    expect(user).not.toBeNull();
    const displayUpper = username.toUpperCase();
    const replacedUser = username.replace("2","3");
    await service.edit(user.id,{display_name:displayUpper});
    user = await service.get(user.id);
    expect(user.display_name).toBe(displayUpper);
    await service.edit(user.id,{username:replacedUser});
    user = await service.get(user.id);
    expect(user.username).toBe(replacedUser);
  });
  it("Should invalidate all auths on password change",async () => {
    expect(user).not.toBeNull();
    const changedPassword = password.replace("pass","ssap");
    for(let i = 0; i < 2;i++)
      await authService.create({ip:"0.0.0.0",ua:"test",user_id:user.id});
    await service.edit(user.id,{password:changedPassword});
    const auths = await authService.getByUserId(user.id);
    expect(auths.length).toBe(0);
  });
  it("Should delete user",async () => {
    expect(user).not.toBeNull();
    await service.delete(user.id);
    user = await service.get(user.id);
    expect(user).toBeNull();
  });
});