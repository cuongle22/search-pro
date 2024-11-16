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
import { UserResponseMapper } from '~/mappers/responses/UserResponseMapper';
import { UserCreationDto, UserLoginDto } from '../../../shares/dtos';
import { UserLoginResponseDto } from '../../../shares/dtos/user-login-response.dto';
import { UserResponseDto } from '../../../shares/dtos/user-response.dto';
import UserService from './user.service';
import { JwtGuard } from '../../common/auth/guard/jwt.guard';
import TokenService from '../../common/auth/token.service';

@ApiTags('Admin Users')
@Controller('admin/users')
export class UserController {
  constructor(
    private readonly authService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: UserResponseDto,
  })
  async register(
    @Body() userCreationDto: UserCreationDto,
  ): Promise<UserResponseDto> {
    const user = await this.authService.register(userCreationDto);
    return new UserResponseMapper().map(user);
  }

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
    return this.authService.login(userLoginDto);
  }

  @UseGuards(JwtGuard)
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
