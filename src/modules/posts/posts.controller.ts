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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/req/createPostDto';
import { ReqAfterGuard } from '../auth/dto/req/reqAfterGuard';
import { CurrentUser } from '../auth/decorators/currentUserDecorator';
import { CreateUpdateResDto } from './dto/res/createUpdateResDto';
import { PostMapper } from './mappers/postMapper';
import { UpdatePostDto } from './dto/req/updatePostDto';
import { PostListRequeryDto } from './dto/req/PostListReqQueryDto';
import { PostListResDto } from './dto/res/PostListResDto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBody({ type: CreatePostDto })
  @Post()
  public async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() userData: ReqAfterGuard,
  ): Promise<CreateUpdateResDto> {
    const result = await this.postsService.create(createPostDto, userData);
    return PostMapper.toResCreateDto(result);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a post' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get(':postId')
  public async getById(
    @Param('postId') postId: string,
  ): Promise<CreateUpdateResDto> {
    const result = await this.postsService.getById(postId);
    return PostMapper.toResCreateDto(result);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  public async getList(
    @Query() query: PostListRequeryDto,
  ): Promise<PostListResDto> {
    const [entites, number] = await this.postsService.getList(query);
    return PostMapper.toResListDto(entites, number, query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully updated.',
  })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBody({ type: UpdatePostDto })
  @Put(':postId')
  public async update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<CreateUpdateResDto> {
    const result = await this.postsService.updatePost(postId, updatePostDto);
    return PostMapper.toResCreateDto(result);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':postId')
  public async deletePost(@Param('postId') postId: string): Promise<void> {
    await this.postsService.deletePost(postId);
  }
}
