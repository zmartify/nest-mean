import { Test, TestingModule } from '@nestjs/testing';
import { OpenhabAccessLogService } from './openhab-access-log.service';

describe('OpenhabAccessLogService', () => {
  let service: OpenhabAccessLogService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenhabAccessLogService],
    }).compile();
    service = module.get<OpenhabAccessLogService>(OpenhabAccessLogService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
