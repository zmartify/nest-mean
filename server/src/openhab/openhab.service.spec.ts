import { Test, TestingModule } from '@nestjs/testing';
import { OpenhabService } from './openhab.service';

describe('OpenhabService', () => {
  let service: OpenhabService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenhabService],
    }).compile();
    service = module.get<OpenhabService>(OpenhabService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
