import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class Register {
  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak, The first character should be uppercase and have 1 special character',
  })
  password: string

  @IsString()
  name: string
}
