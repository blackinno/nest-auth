import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AuthUser } from 'src/auth/dto/user.dto'
import { AuthRequest } from './../auth/auth.controller'
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard'

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  @Get('me')
  me(@Req() req: AuthRequest): AuthUser {
    return req.user
  }
}
