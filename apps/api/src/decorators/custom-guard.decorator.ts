import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '~/modules/common/auth/interfaces/jwt-payload.interface';
import { ROLES_KEY } from './role.decorator';

@Injectable()
export class CustomGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header is missing or invalid',
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.verify<JwtPayload>(token, {
      secret: process.env.TOKEN_SECRET_KEY,
    });

    if (!requiredRoles.includes(payload.role)) {
      throw new UnauthorizedException('User does not have the required role');
    }

    return true;
  }
}
