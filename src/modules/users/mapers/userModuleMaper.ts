import { UsersEntity } from '../../../database/entities/users.entity';
import { CreateUserAdminRes } from '../dto/res/createUserAdminRes';
import { UpdateMeDto } from '../dto/req/updateMeDto';

export class UserModuleMaper {
  public static toResUserByAdmin(createdUser: UsersEntity): CreateUserAdminRes {
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
