import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PostsEntity } from '../../../database/entities/post.entity';
import { PostsService } from '../../posts/posts.service';
import { UsersService } from '../users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly postsService: PostsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const entityId = request.params.id;
    const controller = context.getClass().name;

    const hasRole = roles.some((role) => user.role?.includes(role));
    if (hasRole) {
      return true;
    }

    if (controller === 'PostsController') {
      const entity = await this.getAdByPostId(entityId); // перевіряю чи то власник
      return entity && entity.userID === user.id;
    }
    throw new ForbiddenException('You cant do it');
  }

  private async getAdByPostId(id: string): Promise<PostsEntity> {
    return await this.postsService.getByPostId(id);
  }
}
