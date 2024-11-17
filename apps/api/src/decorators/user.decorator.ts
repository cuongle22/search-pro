import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from '~/entities';
import { UserResponseMapper } from '~/mappers/responses/UserResponseMapper';
import { UserResponseDto } from '~/share/dtos/user-response.dto';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): UserResponseDto => {
    const request = context.switchToHttp().getRequest<Request>();
    return new UserResponseMapper().map(request.user as UserEntity);
  },
);
