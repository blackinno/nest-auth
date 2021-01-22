import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiBody } from '@nestjs/swagger'
import { randomBytes } from 'crypto'
import { Request } from 'express'
import { User } from 'src/user/entities/user.entity'
import { respValue, setTokenAndExpires } from 'src/utils/auth'
import { Resp } from 'src/utils/dto/utils.dto'
import { MoreThanOrEqual } from 'typeorm'
import { Credential } from './dto/credential.dto'
import { Login } from './dto/login.dto'
import { PasswordForgot } from './dto/password.forgot.dto'
import { PasswordReset } from './dto/password.reset.dto'
import { Register } from './dto/register.dto'
import { AuthUser } from './dto/user.dto'
import { GoogleAuthGuard } from './guard/google-auth.guard'
import { LocalAuthGuard } from './guard/local-auth.guard'

export type AuthRequest = Request & { user: AuthUser }

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post('register')
  async register(@Body() userToCreate: Register): Promise<AuthUser> {
    try {
      const token = randomBytes(20).toString('hex')
      const expiration = new Date()
      expiration.setMinutes(expiration.getMinutes() + 15)
      const user = await User.create({
        ...userToCreate,
        email: userToCreate.email.toLowerCase(),
        password: User.hashPassword(userToCreate.password),
        emailVerifyToken: token,
        emailVerifyExpires: expiration,
      }).save()

      // TODO: Send Verify Email before return

      return new AuthUser(user)
    } catch (error) {
      console.log(error)
      if (error.code == '23505') throw new BadRequestException('email already exist')
      throw new BadRequestException()
    }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: Login })
  login(@Req() req: AuthRequest): Credential {
    return {
      access_token: this.jwtService.sign({
        email: req.user.email,
        sub: {
          id: req.user.id,
          name: req.user.name,
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt,
        },
      }),
    }
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  authGoogle() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  google(@Req() req: Request) {
    return req.user
  }

  // @Get('facebook')
  // @UseGuards(FacebookAuthGuard)
  // authFacebook() {}

  // @Get('facebook/redirect')
  // @UseGuards(FacebookAuthGuard)
  // facebook(@Req() req: Request) {
  //   return req.user
  // }

  @Post('password/forgot')
  async lost(@Body() payload: PasswordForgot): Promise<Resp> {
    const user = await User.findOneByEmail(payload.email)
    if (!user) throw new NotFoundException('email does not exist')

    if (user.provider === 'google' || user.provider === 'facebook')
      throw new BadRequestException('your account is register with Google/Facebook')

    const { token, expiration } = setTokenAndExpires(30)

    user.resetPasswordToken = token
    user.resetPasswordExpires = expiration
    await user.save()

    // TODO: Send Reset passwd to email

    return respValue('email reset password has send')
  }

  @Post('password/reset')
  async reset(@Body() payload: PasswordReset): Promise<Resp> {
    const user = await User.findOne({
      where: { resetPasswordToken: payload.token, resetPasswordExpires: MoreThanOrEqual(new Date()) },
    })
    if (!user) throw new UnauthorizedException('token invalid or expired')

    await User.update(user.id, {
      password: User.hashPassword(payload.password),
      resetPasswordToken: null,
      resetPasswordExpires: null,
    })

    return respValue('reset password has success')
  }
}
