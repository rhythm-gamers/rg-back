/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { RPostService } from "../service/rpost.service";
import { CreatePostDto } from "../dto/create-post.dto";
import { TokenPayload } from "src/auth/object/token-payload.obj";
import { HttpStatusCode } from "axios";
import { Response } from "express";
import { UpdatePostDto } from "../dto/update-post.dto";
import { SkipAuth } from "src/token/token.metadata";
import { ToggleLike } from "src/common/enum/toggle-like.enum";
import { SearchPostQuery } from "../dto/search-post.query";
import { PagenatedPostQuery } from "../dto/pagenate-post.query";
import { getPagenatedPostsSchema, getPostSchema, getSearchPostsSchema } from "../dto/schema";

@ApiTags("rpost")
@Controller("rpost")
export class RPostController {
  constructor(
    private readonly postService: RPostService,
  ) {}
  // Search Post
  @SkipAuth()
  @Get("search")
  @ApiOkResponse({
    schema: { example: getSearchPostsSchema }
  })
  @ApiBadRequestResponse()
  async searchPost(
    @Req() req,
    @Res() res: Response,
    @Query() queries: SearchPostQuery,
  ) {
    try {
      const posts = await this.postService.search(queries.boardname, queries.searchTerm, (+queries.page) - 1, +queries.take);
      res.send(posts);
    } catch (e) {
      console.log(e.message);
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Create Post
  @Post()
  @ApiCreatedResponse({description: "생성 성공"})
  @ApiBadRequestResponse()
  async createPost(
    @Req() req,
    @Res() res: Response,
    @Body() dto: CreatePostDto,
  ) {
    const user: TokenPayload = req.user;
    try {
      await this.postService.create(+user.uid, dto);
      res.status(HttpStatusCode.Created).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Get Posts - 첫 게시판 접속은 한번에 받아오고, 이후에는 controller로 받아옴
  @SkipAuth()
  @Get()
  @ApiOkResponse({
    schema: { example: getPagenatedPostsSchema }
  })
  @ApiBadRequestResponse()
  async pagenatedPosts(
    @Req() req,
    @Res() res: Response,
    @Query() queries: PagenatedPostQuery,
  ) {
    try {
      const posts = await this.postService.fetchPagenatedPostsWithBoardname(queries.boardname, (+queries.page) - 1, +queries.take);
      res.status(HttpStatusCode.Ok).send(posts);
    } catch (e) {
      console.log(e);
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Get Post + Get Comments
  @SkipAuth()
  @Get(":postid")
  @ApiOkResponse({
    schema: { example: getPostSchema }
  })
  @ApiBadRequestResponse()
  async getPost(
    @Req() req,
    @Res() res: Response,
    @Param("postid") postid: number
  ) {
    try {
      const post = await this.postService.fetchPostWithId(+postid);
      res.status(HttpStatusCode.Ok).send(post);
    } catch (e) {
      console.log(e);
      res.status(HttpStatusCode.BadRequest).send();
    }
  }


  // Update Post
  @Patch(":postid")
  @ApiOkResponse({description: "수정 성공"})
  @ApiBadRequestResponse()
  async updatePost(
    @Req() req,
    @Res() res: Response,
    @Param("postid") postid: number,
    @Body() dto: UpdatePostDto,
  ) {
    const user: TokenPayload = req.user;
    try {
      await this.postService.update(+user.uid, +postid, dto);
      res.status(HttpStatusCode.Ok).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }

  }

  // Delete Post 
  @Delete(":postid")
  @ApiOkResponse({description: "삭제 성공"})
  @ApiBadRequestResponse()
  async deletePost(
    @Req() req,
    @Res() res: Response,
    @Param("postid") postid: number,
  ) {
    const user: TokenPayload = req.user;
    try {
      await this.postService.delete(+user.uid, +postid);
      res.status(HttpStatusCode.Ok).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Increase Like Count
  @Post("like/:postid")
  @ApiCreatedResponse({description: "좋아요 증가"})
  @ApiNoContentResponse({description: "좋아요 취소"})
  @ApiBadRequestResponse()
  async togglePostLike(
    @Req() req,
    @Res() res: Response,
    @Param("postid") postid: number,
  ) {
    const user: TokenPayload = req.user;
    try {
      const result = await this.postService.togglePostLike(+user.uid, +postid);
      if (result === ToggleLike.Create) {
        res.status(HttpStatusCode.Created).send();
      } else {
        res.status(HttpStatusCode.NoContent).send();
      }
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }
}
