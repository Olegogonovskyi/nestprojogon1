import { Module } from '@nestjs/common';
import { PostViewService } from './post-view.service';


@Module({
  providers: [PostViewService],
})
export class PostViewModule {}
