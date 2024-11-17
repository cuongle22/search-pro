import {
  Body,
  Controller,
  Get,
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
import { CurrentUser } from '~/decorators/user.decorator';
import { UserResponseMapper } from '~/mappers/responses/UserResponseMapper';
import {
  UserCreationDto,
  UserLoginDto,
  UserLoginResponseDto,
} from '~/share/dtos';
import { UserResponseDto } from '../../share/dtos/user-response.dto';
import { JwtGuard } from '../share/auth/guard/jwt.guard';
import { UserService } from './user.service';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import TokenService from '../share/auth/token.service';
import { Request } from 'express';

@ApiTags('App Users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get current user info' })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Current user info',
    type: UserResponseDto,
  })
  getMe(@CurrentUser() user: UserResponseDto): UserResponseDto {
    return user;
  }

  @Post()
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: UserResponseDto,
  })
  async register(
    @Body() userCreationDto: UserCreationDto,
  ): Promise<UserResponseDto> {
    //FIXME: using mapper instead
    const user = await this.userService.createUser(userCreationDto);
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
    return this.userService.login(userLoginDto);
  }

  @UseGuards(JwtGuard)
  @RolesGuard('APP_USER')
  @Post('logout')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Req() req: Request): Promise<void> {
    const authHeader = req.headers?.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    await this.tokenService.toBlacklist(token);
  }
}
