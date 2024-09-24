import { PostsEntity } from '../../../database/entities/post.entity';

export class PostViewedEvent {
  constructor(public readonly post: PostsEntity) {}
}
