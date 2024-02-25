import { Module } from '@nestjs/common';
import { WikiService } from './wiki.service';
import { WikiController } from './wiki.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wiki } from './entity/wiki.entity';

@Module({
  controllers: [WikiController],
  providers: [WikiService],
  imports: [TypeOrmModule.forFeature([Wiki])],
})
export class WikiModule {}
