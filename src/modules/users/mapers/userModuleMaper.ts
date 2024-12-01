import { UsersEntity } from '../../../database/entities/users.entity';
import { CreateUserAdminResDto } from '../dto/res/createUserAdminRes.dto';
import { UpdateMeDto } from '../dto/req/updateMe.dto';

export class UserModuleMaper {
  public static toResUserByAdmin(
    createdUser: UsersEntity,
  ): CreateUserAdminResDto {
    const { id, name, email, position, role, age } = createdUser;
    return {
      id,
      name,
      email,
      age,
      role,
      position,
    };
  }

  public static toResUser(userDto: UsersEntity): UpdateMeDto {
    const { id, name, age, email } = userDto;
    return {
      id,
      name,
      age,
      email,
    };
  }
}
