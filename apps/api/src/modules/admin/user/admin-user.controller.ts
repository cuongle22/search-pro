import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserLoginDto } from '../../../shares/dtos';
import { UserLoginResponseDto } from '../../../shares/dtos/user-login-response.dto';
import { JwtGuard } from '../../common/auth/guard/jwt.guard';
import TokenService from '../../common/auth/token.service';
import AdminUserService from './admin-user.service';
import { RolesGuard } from '~/decorators/role-guard.decorator';

@ApiTags('System')
@Controller('admin/users')
export class AdminUserController {
  constructor(
    private readonly userService: AdminUserService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    type: UserLoginResponseDto,
    description: 'Return accessToken',
  })
  async login(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<UserLoginResponseDto> {
    return this.userService.login(userLoginDto);
  }

  @UseGuards(JwtGuard)
  @RolesGuard('SUPER_ADMIN')
  @Post('logout')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Req() req: Request): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    await this.tokenService.toBlacklist(token);
  }
}
