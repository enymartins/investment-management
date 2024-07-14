import { Module, ValidationPipe } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbModule } from './db/db.module'
import { InvestmentsModule } from './investments/investments.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { WithdrawalsModule } from './withdrawals/withdrawals.module'

@Module({
  imports: [
    CacheModule.register({
      ttl: 10,
      max: 200,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    InvestmentsModule,
    DbModule,
    UsersModule,
    AuthModule,
    WithdrawalsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
