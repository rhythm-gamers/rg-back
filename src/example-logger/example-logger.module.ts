import { Module } from '@nestjs/common';
import { ExampleLoggerController } from './example-logger.controller';

@Module({
  controllers: [ExampleLoggerController]
})
export class ExampleLoggerModule {}
