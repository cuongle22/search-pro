import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule as AppUserModule } from '../../user/user.module';
import { UserController } from './user.controller';
import UserService from './user.service';
import TokenService from '../../common/auth/token.service';
import { JwtStrategy } from '../../common/auth/strategy';

@Module({
  imports: [AppUserModule, JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, TokenService],
})
export class UserModule {}
