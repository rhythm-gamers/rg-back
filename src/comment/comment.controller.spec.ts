import { Test, TestingModule } from "@nestjs/testing";
import { CommentController } from "./controller/comment.controller";
import { CommentService } from "./service/comment.service";

describe("CommentController", () => {
  let controller: CommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [CommentService],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
