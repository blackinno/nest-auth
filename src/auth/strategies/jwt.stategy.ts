import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from '../../user/entities/user.entity'
import { JWT } from '../dto/jwt.dto'
import { AuthUser } from '../dto/user.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET_KEY'),
    })
  }

  async validate(payload: JWT): Promise<AuthUser> {
    if (!payload.email) throw new UnauthorizedException()
    const user = await User.findOneByEmail(payload.email.toLowerCase())
    if (!user) throw new UnauthorizedException()
    return new AuthUser(user)
  }
}
