import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import { AdminLocationController } from './admin-location.controller';
import { AdminLocationService } from './admin-location.service';
import { AdminUserModule } from '../user/admin-user.module';
import AdminUserService from '../user/admin-user.service';
import TokenService from '~/modules/common/auth/token.service';

@Module({
  imports: [AdminUserModule],
  providers: [
    AdminLocationService,
    JwtService,
    CustomGuard,
    AdminUserService,
    TokenService,
  ],
  controllers: [AdminLocationController],
  exports: [AdminLocationService],
})
export class AdminLocationModule {}
