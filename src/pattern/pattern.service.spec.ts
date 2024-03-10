import { Test, TestingModule } from '@nestjs/testing';
import { PatternService } from './pattern.service';

describe('PatternService', () => {
  let service: PatternService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatternService],
    }).compile();

    service = module.get<PatternService>(PatternService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
