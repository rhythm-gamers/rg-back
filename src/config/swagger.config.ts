import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import expressBasicAuth from "express-basic-auth";

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("리듬게이머즈")
    .setDescription("개발용 API 리스트")
    .setVersion("0.2")
    .addTag("level test", "level test operation")
    .addTag("practice", "practice operation")
    .addTag("wiki", "wiki operation")
    .addTag("post", "post operation")
    .addTag("comment", "comment operation")
    .addTag("board", "board operation")
    .addTag("progress", "progress operation")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  app.use(
    ["api"],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_ID]: process.env.SWAGGER_PASSWORD },
    }),
  );
};
