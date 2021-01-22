import { IsArray, IsDate, IsEmail, IsOptional, IsString, IsUUID } from 'class-validator'
import { UserAddress } from 'src/user/dto/address.dto'

export class AuthUser {
  @IsUUID()
  id: string

  @IsEmail()
  email: string

  @IsString()
  name: string

  @IsOptional()
  @IsString()
  avatar: string

  @IsArray()
  address: Array<UserAddress>

  @IsString()
  role: string

  @IsString()
  provider: string

  @IsDate()
  createdAt: Date

  @IsDate()
  updatedAt: Date

  constructor(user: {
    id: string
    email: string
    name: string
    role: string
    provider: string
    createdAt: Date
    updatedAt: Date
    avatar?: string
    address?: Array<UserAddress>
  }) {
    this.id = user.id
    this.email = user.email
    this.name = user.name
    this.role = user.role
    this.avatar = user.avatar
    this.address = user.address
    this.provider = user.provider
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
  }
}
