import { RegisterAuthResDto } from '../dto/res/register.auth.res.dto';
import { UsersEntity } from '../../../database/entities/users.entity';
import { JwtPayload } from '../models/jwtPayload';
import { ReqAfterGuard } from '../dto/req/reqAfterGuard';

export class UserMapper {
  public static toResponseDTO(data: UsersEntity): RegisterAuthResDto {
    return {
      id: data.id,
      name: data.name,
      age: data.age,
      email: data.email,
      image: data.image
        ? `${process.env.AWS_S3_BUCKET_URL}/${data.image}`
        : null,
    };
  }

  public static toReqUserData(
    user: UsersEntity,
    payload: JwtPayload,
  ): ReqAfterGuard {
    return {
      id: payload.userId,
      deviceId: payload.deviceId,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}
