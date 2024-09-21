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
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<CreateUpdateResDto> {
    const result = await this.postsService.updatePost(id, updatePostDto);
    return PostMapper.toResCreateDto(result);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Delete(':id')
  public async deletePost(@Param('id') id: string): Promise<void> {
    await this.postsService.deletePost(id);
  }
}
