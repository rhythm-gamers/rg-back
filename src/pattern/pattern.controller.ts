import { Controller } from '@nestjs/common';
import { PatternService } from './pattern.service';

@Controller('pattern')
export class PatternController {
  constructor(private readonly patternService: PatternService) {}
}
