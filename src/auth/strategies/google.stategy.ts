import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-google-oauth20'
import { User } from 'src/user/entities/user.entity'
import { AuthUser } from '../dto/user.dto'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK'),
      scope: ['email', 'profile'],
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<AuthUser> {
    const { displayName, emails, photos, provider } = profile
    try {
      let user = await User.findOneByEmail(emails[0].value)
      if (!user) {
        user = await User.create({
          name: displayName,
          avatar: photos[0].value,
          email: emails[0].value,
          emailVerify: emails[0].verified,
          provider: provider,
        }).save()
      } else {
        user.name = displayName
        user.avatar = photos[0].value
        user.save()
      }
      return new AuthUser(user)
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
