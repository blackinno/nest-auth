import { IsString } from 'class-validator'

export class PasswordReset {
  @IsString()
  password: string

  @IsString()
  token: string
}
