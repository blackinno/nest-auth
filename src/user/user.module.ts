import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { entities } from './entities'
import { UserController } from './user.controller'

@Module({ imports: [TypeOrmModule.forFeature([...entities])], controllers: [UserController] })
export class UserModule {}
