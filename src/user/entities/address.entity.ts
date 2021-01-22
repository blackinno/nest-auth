import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  addr: string

  @Column()
  subDistrict: string

  @Column()
  district: string

  @Column()
  province: string

  @Column()
  zipCode: string

  @ManyToOne(() => User, user => user.address)
  user: User

  @CreateDateColumn()
  createdAt: Date

  @CreateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ default: null })
  deletedAt: Date
}
