import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard'
import { UserController } from './user.controller'

describe('UserController', () => {
  let controller: UserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<UserController>(UserController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('User Information', () => {
    it('/me (display user information)', () => {
      const user = {
        id: '9c8dbb1c-8b9f-4a9e-bd0d-64041934d520',
        name: 'Angus Purdy',
        email: 'mail@mail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const request: any = {} as Request

      const AuthRequest = { ...request, user }

      expect(controller.me(AuthRequest)).toEqual(user)
    })
  })
})
