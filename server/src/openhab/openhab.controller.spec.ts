import { Test, TestingModule } from '@nestjs/testing';
import { OpenhabController } from './openhab.controller';

describe('Openhab Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [OpenhabController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: OpenhabController = module.get<OpenhabController>(OpenhabController);
    expect(controller).toBeDefined();
  });
});
