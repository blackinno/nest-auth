import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { RolesGuard } from './guard/roles-auth.guard'
import { GoogleStrategy } from './strategies/google.stategy'
import { JwtStrategy } from './strategies/jwt.stategy'
import { LocalStrategy } from './strategies/local.stategy'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get('SECRET_EXPIRED'),
        },
      }),
    }),
  ],
  providers: [RolesGuard, LocalStrategy, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
