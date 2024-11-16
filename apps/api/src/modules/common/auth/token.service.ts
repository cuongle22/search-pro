import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export default class TokenService {
  private redis: Redis;
  private ttl: number = 3600;

  constructor() {
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
}
