import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostModule } from "src/post/post.module";

import { Board } from "./entity/board.entity";

import { BoardController } from "./controller/board.controller";
import { BoardService } from "./service/board.service";

import { RBoardController } from "./controller/rboard.controller";
import { RBoardService } from "./service/rboard.service";

@Module({
  controllers: [BoardController, RBoardController],
  providers: [BoardService, RBoardService],
  imports: [TypeOrmModule.forFeature([Board]), forwardRef(() => PostModule)],
  exports: [BoardService, RBoardService],
})
export class BoardModule {}
