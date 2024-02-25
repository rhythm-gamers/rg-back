import { Test, TestingModule } from "@nestjs/testing";
import { ExampleLoggerController } from "./example-logger.controller";

describe("ExampleLoggerController", () => {
  let controller: ExampleLoggerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExampleLoggerController],
    }).compile();

    controller = module.get<ExampleLoggerController>(ExampleLoggerController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
