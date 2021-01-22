import { compare, genSaltSync, hashSync } from 'bcrypt'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { Address } from './address.entity'

export type ProviderType = 'local' | 'google' | 'facebook'
export type StatusType = 'active' | 'disabled' | 'in-active'
export type RolesTypes = 'owner' | 'admin' | 'user'

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ default: null })
  avatar: string

  @Column({ nullable: false })
  email: string

  @Column({ default: null })
  password: string

  @Column({ nullable: false, type: 'enum', enum: ['owner', 'admin', 'user'], default: 'user' })
  role: RolesTypes

  @Column({ nullable: false, type: 'enum', enum: ['active', 'disabled', 'in-active'], default: 'active' })
  status: StatusType

  @Column({ nullable: false, type: 'enum', enum: ['local', 'google', 'facebook'], default: 'local' })
  provider: ProviderType

  @OneToMany(() => Address, address => address.user, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  address?: Address[]

  @Column({ default: false })
  emailVerify: boolean

  @Column({ default: null })
  emailVerifyToken: string

  @Column({ default: null })
  emailVerifyExpires: Date

  @Column({ default: null })
  resetPasswordToken: string

  @Column({ default: null })
  resetPasswordExpires: Date

  @Column({ default: 0 })
  loginFailed: number

  @Column({ default: null })
  disableLoginExpires: Date

  @CreateDateColumn({ name: 'created_at', nullable: false, default: 'now()' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: false, onUpdate: 'now()', default: 'now()' })
  updatedAt: Date

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date

  static hashPassword(password: string): string {
    return hashSync(password, genSaltSync())
  }

  static async findById(id: string): Promise<User> {
    return this.findOneOrFail(id)
  }

  static async findOneByEmail(email: string): Promise<User | undefined> {
    return this.findOne({
      where: { email },
    })
  }

  validatePassword(inputPassword: string): Promise<boolean> {
    return compare(inputPassword, this.password)
  }
}
