import { EntityManager } from '@mikro-orm/core';
import { GoneException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { UserEntity } from '~/entities';
import { UserResponseMapper } from '~/mappers/responses/UserResponseMapper';
import { UserLoginDto } from '../../../shares/dtos';
import TokenService from '../../common/auth/token.service';

@Injectable()
export default class AdminUserService {
  constructor(
    private readonly em: EntityManager,
    private readonly tokenService: TokenService,
  ) {}

  async login(userLoginDto: UserLoginDto) {
    const user = await this.em.findOne(
      UserEntity,
      {
        email: userLoginDto.email,
      },
      { populate: ['role', 'stores'] },
    );

    if (!user?.isActive() || !user?.isSuperAdmin()) {
      throw new GoneException('User not found!');
    }

    const isVerified = await argon.verify(
      user.password ?? '',
      userLoginDto.password,
    );

    if (!isVerified) {
      throw new GoneException('Password incorrect!');
    }

    const tokenData = await this.tokenService.signJwtToken(
      new UserResponseMapper().map(user),
    );
    await this.tokenService.blacklistPreviousToken(user.id);
    await this.tokenService.toInuse(user.id, tokenData.accessToken);
    return tokenData;
  }

  async findByEmail(email: string) {
    return this.em.findOne(UserEntity, { email });
  }
}
