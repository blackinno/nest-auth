import { IsNumber, IsOptional, IsString } from 'class-validator'

export class Resp {
  @IsNumber()
  statusCode: number

  @IsString()
  message: string

  @IsOptional()
  data?: any
}
