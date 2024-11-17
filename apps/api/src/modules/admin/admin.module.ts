import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import TokenService from '../share/auth/token.service';
import { OrmModule } from '../share/orm/orm.module';
import { AdminStoreController } from './store/admin-store.controller';
import { AdminStoreModule } from './store/admin-store.module';
import { AdminUserController } from './user/admin-user.controller';
import { AdminUserModule } from './user/admin-user.module';
import AdminUserService from './user/admin-user.service';
import { AdminStoreService } from './store/admin-store.service';

@Module({
  imports: [
    OrmModule,
    AdminUserModule,
    AdminStoreModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AdminUserController, AdminStoreController],
  providers: [
    TokenService,
    CustomGuard,
    JwtService,
    AdminUserService,
    AdminStoreService,
  ],
})
export class AdminModule {}
