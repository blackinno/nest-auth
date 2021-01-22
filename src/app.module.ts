import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { join } from 'path'
import { AdminModule } from './admin/admin.module'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { EmailModule } from './email/email.module'
import { HealthController } from './health/health.controller'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../environments', `.env.${process.env.NODE_ENV || 'local'}`),
    }),
    DatabaseModule,
    TerminusModule,
    UserModule,
    AuthModule,
    EmailModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
