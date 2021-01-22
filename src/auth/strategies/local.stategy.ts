import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { User } from 'src/user/entities/user.entity'
import { AuthUser } from '../dto/user.dto'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({ usernameField: 'email' })
  }
  async validate(email: string, password: string): Promise<AuthUser> {
    const user = await User.findOneByEmail(email.toLowerCase())
    if (!user) throw new UnauthorizedException()

    const maxLoginFailed = Number.parseInt(this.configService.get('MAX_LOGIN_FAILED'))
    const disableMin = Number.parseInt(this.configService.get('MAX_LOGIN_DISABLE'))

    if (!user) throw new NotFoundException('email is invalid or exist')
    if (!user.emailVerify) throw new UnauthorizedException("email isn't verify")
    if (user.provider === 'google' || user.provider === 'facebook')
      throw new UnauthorizedException('your account is register with Google/Facebook')

    if (user.disableLoginExpires && user.disableLoginExpires > new Date()) {
      throw new BadRequestException(
        JSON.stringify({
          message: 'account has disables to login',
          time: new Date(user.disableLoginExpires),
        }),
      )
    }

    if (user.loginFailed === maxLoginFailed && user.disableLoginExpires) {
      user.loginFailed = 0
      user.disableLoginExpires = null
      user.save()
    }

    if (!(await user.validatePassword(password))) {
      if (maxLoginFailed === user.loginFailed) {
        const expiration = new Date()
        expiration.setMinutes(expiration.getMinutes() + disableMin)
        user.disableLoginExpires = expiration
        user.save()
        throw new BadRequestException(
          JSON.stringify({
            message: 'account has disables to login',
            time: new Date(expiration),
          }),
        )
      }
      user.loginFailed += 1
      user.save()
      throw new UnauthorizedException('password is invalid')
    }

    if (user.loginFailed > 0 && (user.disableLoginExpires || !user.disableLoginExpires)) {
      user.loginFailed = 0
      user.disableLoginExpires = null
      user.save()
    }
    return new AuthUser(user)
  }
}
