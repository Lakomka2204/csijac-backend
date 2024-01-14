import { INestApplication } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("Auth Service",() => {
  let service: AuthService;

beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });
  
});