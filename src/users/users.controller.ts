import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { ChangePasswordDto, UserLoginDto, UserRegistrationDto } from './dto';
import { UsersService } from './users.service';
import { CookieService } from '../cookie/cookie.service';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { TokenEntities, UserEntities } from './entities';
import { User } from '../common/decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    readonly usersService: UsersService,
    readonly cookieService: CookieService
  ) {}

  @ApiOperation({
    summary: 'Register a new user',
  })
  @ApiResponse({
    status: 201,
    type: UserEntities,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() userData: UserRegistrationDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<UserEntities> {
    const { accessToken, refreshToken, user } =
      await this.usersService.register({ userData });

    this.cookieService.setCookie({
      response,
      refreshToken,
    });

    return {
      user,
      accessToken,
    };
  }

  @ApiOperation({
    summary: 'Login a user',
  })
  @ApiResponse({
    status: 200,
    type: UserEntities,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() userData: UserLoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<UserEntities> {
    const { accessToken, refreshToken, user } = await this.usersService.login({
      userData,
    });

    this.cookieService.setCookie({
      response,
      refreshToken,
    });

    return {
      user,
      accessToken,
    };
  }

  @ApiOperation({
    summary: 'Logout a user',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(204)
  async logout(
    @User('id') userId: number,
    @Res({ passthrough: true }) response: Response
  ): Promise<void> {
    await this.usersService.logout({ userId });

    this.cookieService.unsetCookie(response);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Refresh a user token via cookies',
  })
  @ApiResponse({
    status: 200,
    type: TokenEntities,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Post('/refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<TokenEntities> {
    const { accessToken, refreshToken } =
      await this.usersService.refreshToken(req);

    this.cookieService.setCookie({
      response,
      refreshToken,
    });

    return { accessToken };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change a user password',
  })
  @ApiResponse({
    status: 200,
    type: TokenEntities,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  @HttpCode(200)
  async changePassword(
    @User('id') userId: number,
    @Body() userData: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<TokenEntities> {
    const { accessToken, refreshToken } =
      await this.usersService.changePassword({
        id: userId,
        data: userData,
      });

    this.cookieService.setCookie({
      response,
      refreshToken,
    });

    return { accessToken };
  }
}
