import { AutoPath, RequiredEntityData } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { ConflictException, GoneException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { RoleEntity, UserEntity } from '~/entities';
import { UserResponseMapper } from '~/mappers/responses/UserResponseMapper';
import { UserRole, UserStatus } from '~/shares/consts/enums';
import { UserCreationDto, UserLoginDto } from '~/shares/dtos';
import TokenService from '../common/auth/token.service';

@Injectable()
export class UserService {
  public defaultPopulate: AutoPath<UserEntity, any> = ['role', 'stores'];
  constructor(
    private readonly em: EntityManager,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(userCreationDto: UserCreationDto): Promise<UserEntity> {
    const existedUser = await this.em.findOne(UserEntity, {
      email: userCreationDto.email,
    });
    if (existedUser) {
      throw new ConflictException('User already exists!');
    }

    const password = await argon.hash(userCreationDto.password);
    const role = await this.em.findOneOrFail(RoleEntity, {
      role: UserRole.APP_USER,
    });
    const requiredData: RequiredEntityData<UserEntity> = {
      ...userCreationDto,
      email: userCreationDto.email,
      password,
      role: role.id,
      status: UserStatus.ACTIVE,
    };
    const user = this.em.create(UserEntity, requiredData);
    await this.em.persistAndFlush(user);
    return user;
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.em.findOne(
      UserEntity,
      {
        email: userLoginDto.email,
      },
      { populate: ['role', 'stores'] },
    );

    if (!user?.isActive() || !user?.isAppUser()) {
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

  async findByEmail(email: string, populate?: string[]) {
    return this.em.findOne(
      UserEntity,
      { email },
      { populate: (populate ? populate : this.defaultPopulate) as never[] },
    );
  }
}
