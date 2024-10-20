import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import expressBasicAuth from "express-basic-auth";

export const setupSwagger = (app: INestApplication) => {
  const version = "0.3";
  const config = new DocumentBuilder()
    .setTitle("리듬게이머즈 v1")
    .setDescription("개발용 v1 API 리스트")
    .setVersion(version)
    .addTag("auth", "register/login/logout operation")
    .addTag("User Setting", "user operation")
    .addTag("칭호", "chingho opretaion")
    .addTag("steam", "steam operation")
    .addTag("progress", "progress operation")
    .addTag("level test", "level test operation")
    .addTag("practice", "practice operation")
    .addTag("wiki", "wiki operation")
    .addTag("board", "board operation")
    .addTag("post", "post operation")
    .addTag("comment", "comment operation")
    .addBearerAuth()
    .build();
  const documentV1 = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/v1", app, documentV1);

  const v2 = new DocumentBuilder()
    .setTitle("리듬게이머즈 v2")
    .setDescription("개발용 v2 api 리스트")
    .setVersion(version)
    .addTag("rauth", "register/login/logout operation")
    .addTag("ruser", "user opetation")
    .addTag("rboard", "board operation")
    .addTag("rpost", "post operation")
    .addTag("rcomment", "comment operation")
    .addTag("rchingho", "chingho operation")
    .addTag("rstream", "steam operation")
    .addBearerAuth()
    .build();
  const documentV2 = SwaggerModule.createDocument(app, v2);
  SwaggerModule.setup("/api/v2", app, documentV2);

  app.use(
    ["api"],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_ID]: process.env.SWAGGER_PASSWORD },
    }),
  );
};
