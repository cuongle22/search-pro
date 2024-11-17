import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../common/auth/strategy';
import TokenService from '../../common/auth/token.service';
import { AdminUserController } from './admin-user.controller';
import AdminUserService from './admin-user.service';
import { UserModule } from '~/modules/user/user.module';
import { UserService } from '~/modules/user/user.service';

@Module({
  imports: [AdminUserModule, UserModule, JwtModule.register({})],
  controllers: [AdminUserController],
  providers: [AdminUserService, JwtStrategy, TokenService, UserService],
})
export class AdminUserModule {}
