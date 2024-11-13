import { RequiredEntityData } from '@mikro-orm/core';
import {
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { UserEntity } from '~/entities';
import { UserRole } from '~/shares/consts/enums';
import { UserCreationDto, UserLoginDto } from '../../shares/dtos';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import TokenService from './token.service';

@Injectable()
export default class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async register(userCreationDto: UserCreationDto) {
    const existedUser = await this.userService.findByEmail(
      userCreationDto.email,
    );
    if (existedUser) {
      throw new ConflictException('User already exists!');
    }

    const password = await argon.hash(userCreationDto.password);
    const role = await this.userService.findRole(UserRole.USER);
    if (!role) {
      throw new NotFoundException('Role not found!');
    }
    const requiredData: RequiredEntityData<UserEntity> = {
      ...userCreationDto,
      email: userCreationDto.email,
      password,
      role: role.id,
    };
    return this.userService.createUser(requiredData);
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.userService.findByEmail(userLoginDto.email);

    if (!user?.isActive()) {
      throw new GoneException('User not found!');
    }

    const isVerified = await argon.verify(
      user.password ?? '',
      userLoginDto.password,
    );

    if (!isVerified) {
      throw new GoneException('Password incorrect!');
    }

    const tokenData = await this.signJwtToken(user);
    await this.tokenService.blacklistPreviousToken(user.id);
    await this.tokenService.toInuse(user.id, tokenData.accessToken);
    return tokenData;
  }

  async signJwtToken(user: UserEntity): Promise<{ accessToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.role,
      stores: user.stores.map((store) => store.id),
    };

    console.log(
      this.configService.get('TOKEN_EXPIRATION'),
      this.configService.get('TOKEN_SECRET_KEY'),
    );
    const jwtToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('TOKEN_EXPIRATION'),
      secret: this.configService.get('TOKEN_SECRET_KEY'),
    });

    return {
      accessToken: jwtToken,
    };
  }
}
