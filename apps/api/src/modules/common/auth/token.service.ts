import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { UserResponseDto } from '~/shares/dtos/user-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export default class TokenService {
  private redis: Redis;
  private ttl: number = 3600;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis(
      String(process.env.REDIS_CONNECTION || 'redis://localhost:6379'),
    );
  }

  async toBlacklist(token: string, ttl: number = this.ttl) {
    await this.redis.set(token, 'blacklisted', 'EX', ttl);
  }

  async toInuse(userId: string, token: string, ttl: number = this.ttl) {
    await this.redis.set(userId, token, 'EX', ttl);
  }

  async blacklistPreviousToken(userId: string, ttl: number = this.ttl) {
    const previousToken = await this.redis.get(userId);
    if (previousToken) {
      await this.redis.set(previousToken, 'blacklisted', 'EX', ttl);
    }
  }

  async isInBlacklist(token: string): Promise<boolean> {
    const result = await this.redis.get(token);
    return result === 'blacklisted';
  }

  async signJwtToken(user: UserResponseDto): Promise<{ accessToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.value,
      stores: user?.stores?.map((store) => store.id),
    };
    const jwtToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('TOKEN_EXPIRATION'),
      secret: this.configService.get('TOKEN_SECRET_KEY'),
    });

    return {
      accessToken: jwtToken,
    };
  }
}
