import { Test, TestingModule } from '@nestjs/testing';
import { UberService } from './uber.service';

describe('UberService', () => {
  let service: UberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UberService],
    }).compile();

    service = module.get<UberService>(UberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
