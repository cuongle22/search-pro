import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '~/modules/user/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import TokenService from '../token.service';
import { UserResponseMapper } from '~/mappers/responses/UserResponseMapper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: String(configService.get('TOKEN_SECRET_KEY')),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    if (await this.tokenService.isInBlacklist(token)) {
      throw new UnauthorizedException(
        'You are not allowed to access this resource',
      );
    }
    const user = await this.userService.findByEmail(payload.email);
    if (!user?.isActive()) {
      throw new UnauthorizedException('User not found');
    }
    return new UserResponseMapper().map(user);
  }
}
