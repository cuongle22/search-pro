import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import { AdminStoreController } from './admin-store.controller';
import { AdminStoreService } from './admin-store.service';
import { AdminUserModule } from '../user/admin-user.module';
import AdminUserService from '../user/admin-user.service';
import TokenService from '~/modules/share/auth/token.service';

@Module({
  imports: [AdminUserModule],
  providers: [
    AdminStoreService,
    JwtService,
    CustomGuard,
    AdminUserService,
    TokenService,
  ],
  controllers: [AdminStoreController],
  exports: [AdminStoreService],
})
export class AdminStoreModule {}
