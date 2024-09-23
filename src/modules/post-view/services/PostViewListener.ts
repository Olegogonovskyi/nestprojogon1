import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostViewedEvent } from '../events/post-viewed.event';
import { PostViewService } from './post-view.service';

@Injectable()
export class PostViewListener {
  constructor(private readonly postViewService: PostViewService) {}

  @OnEvent('post.viewed')
  async handlePostViewedEvent(event: PostViewedEvent) {
    await this.postViewService.addView(event.postId);
  }
}
