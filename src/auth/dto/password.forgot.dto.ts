import { IsEmail, IsString } from 'class-validator'

export class PasswordForgot {
  @IsString()
  @IsEmail()
  email: string
}
