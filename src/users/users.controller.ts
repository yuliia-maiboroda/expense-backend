import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserLoginDto, UserRegistrationDto } from './dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { UserEntities } from './entities';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequestWithUserInterface } from 'src/common/interfaces/request.interface';
import { Request, Response } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(readonly usersService: UsersService) {}

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
    @Body() user: UserRegistrationDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<UserEntities> {
    const result = await this.usersService.register(user);

    response.cookie('jwt', result.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      user: result.user,
      accessToken: result.accessToken,
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
    @Body() user: UserLoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<UserEntities> {
    const result = await this.usersService.login(user);

    response.cookie('jwt', result.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      user: result.user,
      accessToken: result.accessToken,
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

    response.clearCookie('jwt');
  }

  @Post('/refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ accessToken: string }> {
    const result = await this.usersService.refreshToken(req);

    response.cookie('jwt', result.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { accessToken: result.accessToken };
  }
}
