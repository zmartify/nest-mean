import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './event.controller';

describe('Account Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AccountController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: AccountController = module.get<AccountController>(AccountController);
    expect(controller).toBeDefined();
  });
});
