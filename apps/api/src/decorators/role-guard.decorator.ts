import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './role.decorator';
import { CustomGuard } from './custom-guard.decorator';

export function RolesGuard(...roles: string[]) {
  return applyDecorators(Roles(...roles), UseGuards(CustomGuard));
}
