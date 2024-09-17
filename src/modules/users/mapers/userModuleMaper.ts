import { UsersEntity } from '../../../database/entities/users.entity';
import { CreateUserAdminRes } from '../dto/res/createUserAdminRes';

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
}
