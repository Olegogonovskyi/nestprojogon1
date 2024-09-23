import { Injectable } from '@nestjs/common';
import { CreatePostViewDto } from './dto/create-post-view.dto';
import { UpdatePostViewDto } from './dto/update-post-view.dto';

@Injectable()
export class PostViewService {
  create(createPostViewDto: CreatePostViewDto) {
    return 'This action adds a new postView';
  }

  findAll() {
    return `This action returns all postView`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postView`;
  }

  update(id: number, updatePostViewDto: UpdatePostViewDto) {
    return `This action updates a #${id} postView`;
  }

  remove(id: number) {
    return `This action removes a #${id} postView`;
  }
}
