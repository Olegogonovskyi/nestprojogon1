import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/req/createPost.dto';
import { ReqAfterGuardDto } from '../auth/dto/req/reqAfterGuard.dto';
import { TagRepository } from '../repository/services/tag.repository';
import { PostRepository } from '../repository/services/post.repository';
import { TagEntity } from '../../database/entities/tag.entity';
import { In } from 'typeorm';
import { PostsEntity } from '../../database/entities/post.entity';
import { UpdatePostDto } from './dto/req/updatePost.dto';
import { PostListRequeryDto } from './dto/req/PostListReqQuery.dto';
import { ExchangeRateService } from '../exchange/exchange.service';

import { RoleEnum } from '../../database/enums/role.enum';

import { validate } from 'class-validator';
import { ExchangeHelper } from './helpers/exchangeHelper';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PostViewedEvent } from './services/postViewEvent';
import { PostViewRepository } from '../repository/services/postView.repository';
import { PaidInfoInterface } from './types/paidInfo.interface';
import { CarBrandRepository } from '../repository/services/carBrand.repository';
import { StatDateEnum } from '../../common/enums/statDateEnum';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagsRepository: TagRepository,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly eventEmitter: EventEmitter2,
    private readonly postViewRepository: PostViewRepository,
    private readonly carBrandRepository: CarBrandRepository,
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

  private async addView(post: PostsEntity): Promise<void> {
    const view = this.postViewRepository.create({ post });
    await this.postViewRepository.save(view);
  }

  @OnEvent('post.viewed')
  private async handlePostViewedEvent(event: PostViewedEvent) {
    await this.addView(event.post);
  }

  public async create(
    createPostDto: CreatePostDto,
    userData: ReqAfterGuardDto,
  ): Promise<PostsEntity> {
    const { prise, priseValue } = createPostDto;
    const { id, role } = userData;

    if (!userData.isVerified) {
      throw new UnauthorizedException('User is not veryfied');
    }
    if (role === RoleEnum.SELLER) {
      const countPosts = await this.postRepository.countPostsByUserId(id);
      if (countPosts >= 1) {
        throw new ForbiddenException(
          'If You want publicate more posts you must pay',
        );
      }
    }
    const carBrandinDataBase = await this.carBrandRepository.findOneBy({
      name: createPostDto.carBrand,
    });

    if (!carBrandinDataBase) {
      throw new ForbiddenException('We dont know about this car brand');
    }
    const { eur, usd } = await this.exchangeRateService.updateExchangeRates();

    const { eurPrice, usdPrice, uahPrice } = ExchangeHelper.priseCalc(
      prise,
      priseValue,
      eur,
      usd,
    );

    const tags = await this.createTags(createPostDto.tags);
    console.log('1');
    const errors = await validate(createPostDto);
    console.log('2');
    if (errors.length > 0) {
      console.log('uuuu');
      const post = this.postRepository.create({
        ...createPostDto,
        userID: userData.id,
        user: userData,
        uahPrice,
        eurPrice,
        usdPrice,
        exchangeRateDate: new Date(),
        editAttempts: 1,
        tags,
      });
      console.log(post.editAttempts);
      const savedPost = await this.postRepository.save(post);
      const posttoChange = await this.getById(savedPost.id, userData);
      throw new BadRequestException(
        `Validation failed. You have only 3 attempts to update post ${posttoChange}`,
      );
    }
    return await this.postRepository.save(
      this.postRepository.create({
        ...createPostDto,
        userID: userData.id,
        user: userData,
        uahPrice,
        eurPrice,
        usdPrice,
        exchangeRateDate: new Date(),
        editAttempts: 0,
        isActive: true,
        tags,
      }),
    );
  }

  public async getByPostId(postId: string): Promise<PostsEntity> {
    return await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
  }

  public async getById(
    postId: string,
    userData: ReqAfterGuardDto,
  ): Promise<[PostsEntity, paidInfo: PaidInfoInterface]> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['user'],
      });
      if (!post) {
        throw new NotFoundException(`Post with ID ${postId} not found`);
      }

      this.eventEmitter.emit('post.viewed', new PostViewedEvent(post));

      const paidInfo: PaidInfoInterface = {
        countViews: 0,
        averagePrise: 0,
        viewsByDay: 0,
        viewsByWeek: 0,
        viewsByMonth: 0,
      };
      if (userData.role !== RoleEnum.SELLER && userData.id == post.userID) {
        paidInfo.countViews = await this.postViewRepository.count({
          where: { post: { id: postId } },
        });
        paidInfo.averagePrise =
          await this.postRepository.getAveragePriceForCarBand(
            post.carBrand,
            post.model,
          );

        paidInfo.viewsByDay = await this.postViewRepository.countViews(
          post.id,
          StatDateEnum.DAY,
        );
        paidInfo.viewsByWeek = await this.postViewRepository.countViews(
          post.id,
          StatDateEnum.WEEK,
        );
        paidInfo.viewsByMonth = await this.postViewRepository.countViews(
          post.id,
          StatDateEnum.MONTH,
        );
      }
      return [post, paidInfo];
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch post details');
    }
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
          `Validation failed. You have only ${3 - post.editAttempts} attempts to update post ${postId}`,
        );
      }
      this.postRepository.merge(post, updatePostDto, { isActive: true });
      await this.postRepository.save(post);
    }
    await this.deletePost(postId);
    throw new BadRequestException('Maximum edit attempts reached');
  }

  public async deletePost(postId: string): Promise<void> {
    await this.postRepository.delete({ id: postId });
  }
}
