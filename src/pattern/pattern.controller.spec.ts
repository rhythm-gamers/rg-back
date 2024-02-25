import { Test, TestingModule } from '@nestjs/testing';
import { PatternController } from './pattern.controller';
import { PatternService } from './pattern.service';

describe('PatternController', () => {
  let controller: PatternController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatternController],
      providers: [PatternService],
    }).compile();

    controller = module.get<PatternController>(PatternController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
