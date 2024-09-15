import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/req/createPostDto';
import { ReqAfterGuard } from '../auth/dto/req/reqAfterGuard';
import { TagRepository } from '../repository/services/tag.repository';
import { PostRepository } from '../repository/services/post.repository';
import { TagEntity } from '../../database/entities/tag.entity';
import { In } from 'typeorm';
import { PostsEntity } from '../../database/entities/post.entity';
import { UpdatePostDto } from './dto/req/updatePostDto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagsRepository: TagRepository,
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
    const tags = await this.createTags(createPostDto.tags);
    console.log(createPostDto);
    return await this.postRepository.save(
      this.postRepository.create({
        ...createPostDto,
        userID: userData.id,
        tags,
      }),
    );
  }

  public async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostsEntity> {
    const post = await this.postRepository.findOneBy({ id: postId });
    this.postRepository.merge(post, updatePostDto);
    return await this.postRepository.save(post);
  }
}
