import { PartialType } from '@nestjs/swagger';
import { CreatePostViewDto } from './create-post-view.dto';

export class UpdatePostViewDto extends PartialType(CreatePostViewDto) {}
