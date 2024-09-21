import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ControllerEnum } from '../../enums/controllerEnum';
import { PostsEntity } from '../../../database/entities/post.entity';
import { PostsService } from '../../posts/posts.service';

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
    console.log(user);
    const entityId = request.params.id;
    const controller = context.getClass().name;
    console.log(controller);

    const hasRole = roles.some((role) => user.roles?.includes(role));
    if (hasRole) {
      return true;
    }

    if (controller === ControllerEnum.POSTS) {
      const entity = await this.getAdByPostId(entityId); // перевіряю чи то власник
      return entity && entity.userID === user.id;
    }
    return false;
  }

  private async getAdByPostId(id: string): Promise<PostsEntity> {
    return await this.postsService.getById(id);
  }
}
