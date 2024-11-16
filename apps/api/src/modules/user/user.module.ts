import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RoleEntity, UserEntity } from '~/entities';
import { UserController } from './user.controller';
import TokenService from '../common/auth/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, RoleEntity])],
  providers: [UserService, JwtService, TokenService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
