import { Injectable } from '@nestjs/common'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class AdminService {
  async getAllUser() {
    return User.createQueryBuilder('users').where('users.role != :role', { role: 'owner' }).getMany()
  }
}
