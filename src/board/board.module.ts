import { Module, forwardRef } from "@nestjs/common";
import { BoardService } from "./board.service";
import { BoardController } from "./board.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Board } from "./entity/board.entity";
import { PostModule } from "src/post/post.module";

@Module({
  controllers: [BoardController],
  providers: [BoardService],
  imports: [TypeOrmModule.forFeature([Board]), forwardRef(() => PostModule)],
  exports: [BoardService],
})
export class BoardModule {}
