import { Injectable } from '@nestjs/common';

import { PostViewRepository } from '../../repository/services/postView.repository';

@Injectable()
export class PostViewService {
  constructor(private readonly postViewRepository: PostViewRepository) {}

  private async addView(postId: number): Promise<void> {}
}
