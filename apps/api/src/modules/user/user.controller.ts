import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '~/decorators/user.decorator';
import { UserResponseDto } from '../../shares/dtos/user-response.dto';
import { JwtGuard } from '../common/auth/guard/jwt.guard';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({
    status: 200,
    description: 'Current user info',
    type: UserResponseDto,
  })
  getMe(@CurrentUser() user: UserResponseDto): UserResponseDto {
    return user;
  }
}
