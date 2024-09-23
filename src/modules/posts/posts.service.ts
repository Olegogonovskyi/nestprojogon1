import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from './dto/req/createPostDto';
import { ReqAfterGuard } from '../auth/dto/req/reqAfterGuard';
import { TagRepository } from '../repository/services/tag.repository';
import { PostRepository } from '../repository/services/post.repository';
import { TagEntity } from '../../database/entities/tag.entity';
import { In } from 'typeorm';
import { PostsEntity } from '../../database/entities/post.entity';
import { UpdatePostDto } from './dto/req/updatePostDto';
import { PostListRequeryDto } from './dto/req/PostListReqQueryDto';
import { ExchangeRateService } from '../exchange/exchange.service';

import { RoleEnum } from '../../database/enums/role.enum';

import { validate } from 'class-validator';
import { ExchangeHelper } from './helpers/exchangeHelper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostViewedEvent } from '../post-view/services/postViewEvent';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagsRepository: TagRepository,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async createTags(tags: string[]): Promise<TagEntity[]> {
    if (!tags || tags.length === 0) return [];
    const entities = await this.tagsRepository.findBy({ name: In(tags) });
    const existingTags = entities.map((entity) => entity.name);
    const newTags = tags.filter((tag) => !existingTags.includes(tag));
    const newEntities = await this.tagsRepository.save(
      newTags.map((tag) => this.tagsRepository.create({ name: tag })),
    );
    return [...entities, ...newEntities];
  }

  public async create(
    createPostDto: CreatePostDto,
    userData: ReqAfterGuard,
  ): Promise<PostsEntity> {
    const { prise, priseValue } = createPostDto;
    const { id, role } = userData;
    if (role === RoleEnum.SELLER) {
      const countPosts = await this.postRepository.countPostsByUserId(id);
      if (countPosts >= 1) {
        throw new ForbiddenException(
          'If You want publicate more posts you must pay',
        );
      }
    }
    const { eur, usd } = await this.exchangeRateService.updateExchangeRates();

    const { eurPrice, usdPrice, uahPrice } = ExchangeHelper.priseCalc(
      prise,
      priseValue,
      eur,
      usd,
    );

    const tags = await this.createTags(createPostDto.tags);
    const errors = await validate(createPostDto);
    if (errors.length > 0) {
      const post = this.postRepository.create({
        ...createPostDto,
        userID: userData.id,
        uahPrice,
        eurPrice,
        usdPrice,
        exchangeRateDate: new Date(),
        editAttempts: 1,
        tags,
      });
      const savedPost = await this.postRepository.save(post);
      const posttoChange = await this.getById(savedPost.id);
      throw new BadRequestException(
        `Validation failed. You have only 3 attempts to update post ${posttoChange}`,
      );
    }
    const post = this.postRepository.create({
      ...createPostDto,
      userID: userData.id,
      uahPrice,
      eurPrice,
      usdPrice,
      exchangeRateDate: new Date(),
      editAttempts: 0,
      isActive: true,
      tags,
    });
    const savedPost = await this.postRepository.save(post);
    return await this.getById(savedPost.id);
  }

  public async getById(postId: string): Promise<PostsEntity> {
    this.eventEmitter.emit('post.viewed', new PostViewedEvent(postId));
    return await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'], // вантажу юзера
    });
  }

  public async getList(
    query: PostListRequeryDto,
  ): Promise<[PostsEntity[], number]> {
    return await this.postRepository.getList(query);
  }

  public async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostsEntity> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (post.editAttempts <= 3) {
      const errors = await validate(updatePostDto);
      if (errors.length > 0) {
        this.postRepository.merge(post, updatePostDto, {
          editAttempts: post.editAttempts + 1,
          isActive: false,
        });
        throw new BadRequestException(
          `Validation failed. You have only ${post.editAttempts - 3} attempts to update post ${postId}`,
        );
      }
      this.postRepository.merge(post, updatePostDto, { isActive: true });
      return await this.postRepository.save(post);
    }
    await this.deletePost(postId);
    throw new BadRequestException('Maximum edit attempts reached');
  }

  public async deletePost(postId: string): Promise<void> {
    await this.postRepository.delete({ id: postId });
  }
}
