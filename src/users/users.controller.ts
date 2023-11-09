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
import { Request, Response } from 'express';

import { UserLoginDto, UserRegistrationDto } from './dto';
import { UsersService } from './users.service';
import { CookieService } from 'src/cookie/cookie.service';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { ResreshEntities, UserEntities } from './entities';
import { RequestWithUserInterface } from 'src/common/interfaces/request.interface';

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
  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() userData: UserRegistrationDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<UserEntities> {
    const { accessToken, refreshToken, user } =
      await this.usersService.register(userData);

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
  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() userData: UserLoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<UserEntities> {
    const { accessToken, refreshToken, user } =
      await this.usersService.login(userData);

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
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(204)
  async logout(
    @Req() req: RequestWithUserInterface,
    @Res({ passthrough: true }) response: Response
  ): Promise<void> {
    this.usersService.logout(req.user.id);

    this.cookieService.unsetCookie(response);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Refresh a user token via cookies',
  })
  @ApiResponse({
    status: 200,
    type: ResreshEntities,
  })
  @Post('/refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<ResreshEntities> {
    const { accessToken, refreshToken } =
      await this.usersService.refreshToken(req);

    this.cookieService.setCookie({
      response,
      refreshToken,
    });

    return { accessToken };
  }
}
