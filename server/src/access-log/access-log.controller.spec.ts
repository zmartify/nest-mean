import { Test, TestingModule } from '@nestjs/testing';
import { AccessLogController } from './access-log.controller';

describe('AccessLog Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AccessLogController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: AccessLogController = module.get<AccessLogController>(AccessLogController);
    expect(controller).toBeDefined();
  });
});
