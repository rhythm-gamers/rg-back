import { Module } from "@nestjs/common";
import { BoardService } from "./board.service";
import { BoardController } from "./board.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Board } from "./entity/board.entity";

@Module({
  controllers: [BoardController],
  providers: [BoardService],
  imports: [TypeOrmModule.forFeature([Board])],
  exports: [BoardService],
})
export class BoardModule {}
