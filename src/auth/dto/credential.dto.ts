import { IsJWT } from 'class-validator'

export class Credential {
  @IsJWT()
  access_token: string
}
