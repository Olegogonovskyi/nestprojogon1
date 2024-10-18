import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/req/createPost.dto';
import { ReqAfterGuardDto } from '../auth/dto/req/reqAfterGuard.dto';
import { CurrentUser } from '../auth/decorators/currentUserDecorator';
import { CreateUpdateResDto } from './dto/res/createUpdateRes.dto';
import { PostMapper } from './mappers/postMapper';
import { UpdatePostDto } from './dto/req/updatePost.dto';
import { PostListRequeryDto } from './dto/req/PostListReqQuery.dto';
import { PostListResDto } from './dto/res/PostListRes.dto';
import { ControllerEnum } from '../enums/controllerEnum';
import { RolesGuard } from '../users/guards/RolesGuard';
import { Roles } from '../users/decorators/roleDecorator';
import { RoleEnum } from '../../database/enums/role.enum';

@ApiTags(ControllerEnum.POSTS)
@Controller(ControllerEnum.POSTS)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @Post()
  public async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() userData: ReqAfterGuardDto,
  ): Promise<CreateUpdateResDto> {
    const [post, paidInfo] = await this.postsService.create(
      createPostDto,
      userData,
    );
    return PostMapper.toResCreateDto(post, paidInfo);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a post' })
  @Get(':postId')
  public async getById(
    @Param('postId') postId: string,
    @CurrentUser() userData: ReqAfterGuardDto,
  ): Promise<CreateUpdateResDto> {
    const [post, paidInfo] = await this.postsService.getById(postId, userData);
    return PostMapper.toResCreateDto(post, paidInfo);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: `Get list of posts`,
  })
  @Get()
  public async getList(
    @Query() query: PostListRequeryDto,
  ): Promise<PostListResDto> {
    const [entites, number] = await this.postsService.getList(query);
    return PostMapper.toResListDto(entites, number, query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post' })
  @ApiBody({ type: UpdatePostDto })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<CreateUpdateResDto> {
    const result = await this.postsService.updatePost(id, updatePostDto);
    return PostMapper.toResUpdateDto(result);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: `Delete post by id`,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Delete(':id')
  public async deletePost(@Param('id') id: string): Promise<void> {
    await this.postsService.deletePost(id);
  }
}
