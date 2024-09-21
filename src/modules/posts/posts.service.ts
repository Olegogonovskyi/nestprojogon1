import { Injectable } from '@nestjs/common';
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
import { PriseEnum } from '../../database/enums/prise.enum';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagsRepository: TagRepository,
    private readonly exchangeRateService: ExchangeRateService,
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
    const { eur, usd } =
      await this.exchangeRateService.updateExchangeRates();
    const { prise, priseValue } = createPostDto; //price = priseValue, currency = prise
    const numericPriseValue = Number(priseValue);
    const dateRate = new Date();

    const postCurrency = new PostsEntity();
    switch (prise) {
      case PriseEnum.USD:
        postCurrency.usdPrice = numericPriseValue;
        postCurrency.eurPrice = numericPriseValue * usd / eur;
        postCurrency.uahPrice = numericPriseValue * usd;
        break;
      case PriseEnum.EUR:
        postCurrency.eurPrice = numericPriseValue;
        postCurrency.usdPrice = numericPriseValue * eur / usd;
        postCurrency.uahPrice = numericPriseValue * eur;
        break;
      case PriseEnum.UAH:
        postCurrency.uahPrice = numericPriseValue;
        postCurrency.usdPrice = numericPriseValue * usd;
        postCurrency.eurPrice = numericPriseValue * eur;
        break;
      default:
        throw new Error('Unsupported currency');
    }

    const tags = await this.createTags(createPostDto.tags);
    const post = this.postRepository.create({
      ...createPostDto,
      userID: userData.id,
      uahPrice: postCurrency.uahPrice,
      eurPrice: postCurrency.eurPrice,
      usdPrice: postCurrency.usdPrice,
      exchangeRateDate: dateRate,
      tags,
    });
    const savedPost = await this.postRepository.save(post);
    return await this.getById(savedPost.id);
    // return await this.postRepository.save(
    //   this.postRepository.create({
    //     ...createPostDto,
    //     userID: userData.id,
    //     tags,
    //   }),
    // );
  }

  public async getById(postId: string): Promise<PostsEntity> {
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
    this.postRepository.merge(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  public async deletePost(postId: string): Promise<void> {
    await this.postRepository.delete({ id: postId });
  }
}
