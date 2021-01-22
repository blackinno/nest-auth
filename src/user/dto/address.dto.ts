import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

export class UserAddress {
  @IsOptional()
  @IsUUID()
  id: string

  @IsString()
  @ApiProperty()
  addr: string

  @IsString()
  @ApiProperty()
  subDistrict: string

  @IsString()
  @ApiProperty()
  district: string

  @IsString()
  @ApiProperty()
  province: string

  @IsString()
  @ApiProperty()
  zipCode: string
}
