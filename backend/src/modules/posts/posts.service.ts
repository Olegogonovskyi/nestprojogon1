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
import { PostRepository } from '../repository/services/post.repository';
import { PostsEntity } from '../../database/entities/post.entity';
import { UpdatePostDto } from './dto/req/updatePost.dto';
import { PostListRequeryDto } from './dto/req/PostListReqQuery.dto';
import { ExchangeRateService } from '../exchange/exchange.service';

import { RoleEnum } from '../../database/enums/role.enum';

import { ExchangeHelper } from './helpers/exchangeHelper';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PostViewedEvent } from './services/postViewEvent';
import { PostViewRepository } from '../repository/services/postView.repository';
import { PaidInfoInterface } from './types/paidInfo.interface';
import { CarBrandRepository } from '../repository/services/carBrand.repository';
import { StatDateEnum } from '../../common/enums/statDateEnum';
import { ValidationCostants } from '../../validationConstants/validation costants';
import { EmailService } from '../emailodule/emailodule.service';
import { UserRepository } from '../repository/services/users.repository';
import { EmailEnum } from '../emailodule/enums/emailEnam';
import { ContentType } from '../filestorage/enums/content-type.enum';
import { FileStorageService } from '../filestorage/filestorageService';
import { EventEnum } from './enums/eventEnum';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly eventEmitter: EventEmitter2, // можна було б і без цього, але в документації ніби так потрібно події обробляти
    private readonly postViewRepository: PostViewRepository,
    private readonly carBrandRepository: CarBrandRepository,
    private readonly emailService: EmailService,
    private readonly userRepository: UserRepository,
  ) {}

  private async addView(post: PostsEntity): Promise<void> {
    const view = this.postViewRepository.create({ post });
    await this.postViewRepository.save(view);
  }

  @OnEvent(EventEnum.POSTVIEW)
  private async handlePostViewedEvent(event: PostViewedEvent) {
    await this.addView(event.post);
  }

  public async create(
    createPostDto: CreatePostDto,
    userData: ReqAfterGuardDto,
    images: Array<Express.Multer.File>,
  ): Promise<PostsEntity> {
    const { prise, priseValue } = createPostDto;
    const { id, role } = userData;

    if (!userData.isVerified) {
      throw new UnauthorizedException('User is not verified');
    }

    if (role === RoleEnum.SELLER) {
      const countPosts = await this.postRepository.countPostsByUserId(id);
      if (countPosts >= 1) {
        throw new ForbiddenException(
          'If you want to publish more posts, you must pay',
        );
      }
    }

    const carBrandinDataBase = await this.carBrandRepository.findOneBy({
      name: createPostDto.carBrand,
    });

    if (!carBrandinDataBase) {
      throw new ForbiddenException("We don't recognize this car brand");
    }

    const { eur, usd } = await this.exchangeRateService.updateExchangeRates();

    const { eurPrice, usdPrice, uahPrice } = ExchangeHelper.priseCalc(
      prise,
      priseValue,
      eur,
      usd,
    );

    const hasForbiddenWords = ValidationCostants.some(
      (word) =>
        createPostDto.title.includes(word) ||
        createPostDto.body.includes(word) ||
        createPostDto.description.includes(word),
    );

    let imageUrls: string[];
    try {
      imageUrls = await Promise.all(
        images.map((file) =>
          this.fileStorageService.uploadFile(file, ContentType.ARTICLE, id),
        ),
      );
    } catch (e) {
      throw new InternalServerErrorException('Images upload failed');
    }

    const postData = {
      ...createPostDto,
      userID: userData.id,
      user: userData,
      uahPrice,
      eurPrice,
      usdPrice,
      exchangeRateDate: new Date(),
      editAttempts: hasForbiddenWords ? 1 : 0,
      isActive: !hasForbiddenWords,
      image: imageUrls,
    };

    if (hasForbiddenWords) {
      const savedPost = await this.postRepository.save(
        this.postRepository.create(postData),
      );
      throw new BadRequestException(
        `Validation failed. You have only 3 attempts to update post ${savedPost.id}`,
      );
    }

    return await this.postRepository.save(this.postRepository.create(postData));
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
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    this.eventEmitter.emit(EventEnum.POSTVIEW, new PostViewedEvent(post));
    const paidInfo: PaidInfoInterface = {
      countViews: 0,
      averagePrise: 0,
      viewsByDay: 0,
      viewsByWeek: 0,
      viewsByMonth: 0,
    };
    if (userData) {
      if (userData.role !== RoleEnum.SELLER || userData.id == post.userID) {
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
    }
    return [post, paidInfo];
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
    const attemts = post.editAttempts;
    if (attemts < 3) {
      const hasForbiddenWords = ValidationCostants.some(
        (word) =>
          updatePostDto.title?.includes(word) ||
          updatePostDto.body?.includes(word) ||
          updatePostDto.description?.includes(word),
      );
      if (hasForbiddenWords) {
        await this.postRepository.save(
          this.postRepository.merge(post, updatePostDto, {
            editAttempts: attemts + 1,
            isActive: false,
          }),
        );

        throw new BadRequestException(
          `Validation failed. You have only ${3 - post.editAttempts} attempts to update post ${postId}`,
        );
      }

      this.postRepository.merge(post, updatePostDto, { isActive: true });
      await this.postRepository.save(post);
      return await this.postRepository.findOne({
        where: { id: post.id },
        relations: ['user'], // розумію, що додаткове навантаження на базу, але додав шоб підвантажило юзера, можна і забрати
      });
    }

    const managers = await this.userRepository.find({
      where: { role: RoleEnum.MANAGER },
    });
    for (const manager of managers) {
      await this.emailService.sendEmail(EmailEnum.BADWORDER, manager.email, {
        layout: 'main',
        postId: postId,
        user: post.userID,
      });
    }
    throw new BadRequestException('Maximum edit attempts reached');
  }

  public async deletePost(postId: string): Promise<void> {
    await this.postRepository.delete({ id: postId });
  }
}
