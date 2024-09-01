/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RPostService } from "../service/rpost.service";
import { CreatePostDto } from "../dto/create-post.dto";
import { TokenPayload } from "src/auth/object/token-payload.obj";
import { HttpStatusCode } from "axios";
import { Response } from "express";
import { UpdatePostDto } from "../dto/update-post.dto";
import { SkipAuth } from "src/token/token.metadata";
import { ToggleLike } from "src/common/enum/toggle-like.enum";

@ApiTags("rpost")
@Controller("rpost")
export class RPostController {
  constructor(
    private readonly postService: RPostService,
  ) {}
  // Search Post
  @SkipAuth()
  @Get("search")
  async searchPost(
    @Req() req,
    @Res() res: Response,
    @Query("term") searchTerm: string,
    @Query("boardname") boardname: string,
    @Query("page") page: number,
    @Query("take") take: number,
  ) {
    const user: TokenPayload = req.user;
    try {
      const posts = await this.postService.search(boardname, searchTerm, (+page) - 1, take);
      res.send(posts) 
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Create Post
  @Post()
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

  // Get Posts
  @SkipAuth()
  @Get()
  async pagenatedPosts(
    @Req() req,
    @Res() res: Response,
    @Query("page") page: number,
    @Query("take") take: number,
    @Query("boardname") boardname: string,
  ) {
    try {
      const posts = await this.postService.fetchPagenatedPostsWithBoardname(boardname, (+page) - 1, +take);
      res.send(posts);
    } catch (e) {
      console.log(e);
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Get Post + Get Comments
  @SkipAuth()
  @Get(":postid")
  async getPost(
    @Req() req,
    @Res() res: Response,
    @Query("postid") postid: number
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
  @Patch()
  async updatePost(
    @Req() req,
    @Res() res: Response,
    @Query("postid") postid: number,
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
  async deletePost(
    @Req() req,
    @Res() res: Response,
    @Param("postid") postid: number,
  ) {
    const user: TokenPayload = req.user;
    try {
      await this.postService.delete(+user.uid, +postid);
      res.send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Increase Like Count
  @Post("like/:postid")
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
