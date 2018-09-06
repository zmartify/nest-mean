import { Test, TestingModule } from '@nestjs/testing';
import { RequestLogController } from './request-log.controller';

describe('RequestLog Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RequestLogController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: RequestLogController = module.get<RequestLogController>(RequestLogController);
    expect(controller).toBeDefined();
  });
});
