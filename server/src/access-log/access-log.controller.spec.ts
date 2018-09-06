import { Test, TestingModule } from '@nestjs/testing';
import { OpenhabAccessLogController } from './openhab-access-log.controller';

describe('OpenhabAccessLog Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [OpenhabAccessLogController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: OpenhabAccessLogController = module.get<OpenhabAccessLogController>(OpenhabAccessLogController);
    expect(controller).toBeDefined();
  });
});
