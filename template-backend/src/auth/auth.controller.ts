import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Header, Post, UseGuards } from '@nestjs/common';

import { NotificationEmailsService } from '../notification_emails/notification_emails.service';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SignupResponseDto } from './dto/signup-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UsersService } from '../users/users.service';
import { LogupDto } from './dto/logup.dto';
import { AuthService } from './auth.service';

@SkipThrottle()
@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly notificationEmailsService: NotificationEmailsService,
    private readonly usersService: UsersService,
  ) {}

  // @Throttle({
  //   auth: ThrottlersUtil.AUTH_DEFAULT_THROTTLER,
  // })
  @Public()
  @Post('logup')
  @ApiOperation({ summary: 'Signup and get tokens' })
  @ApiBody({ type: LogupDto })
  @Header('Content-Type', 'application/json')
  async logup(@Body() dto: LogupDto): Promise<SignupResponseDto> {
    try {
      const user = await this.authService.findUserByEmail(dto.email);
      let tokens: LoginResponseDto;
      if (user) {
        tokens = await this.authService.login({
          email: dto.email,
          password: dto.password,
          token: dto.token,
        } as LogupDto);
      } else {
        tokens = await this.authService.create(dto);
      }
      return Promise.resolve({
        ...tokens,
        user: {
          email: dto.email,
        },
      } as SignupResponseDto);
    } catch (error) {
      throw error;
    }
  }

  // //login

  // // @Throttle({
  // //   auth: ThrottlersUtil.AUTH_DEFAULT_THROTTLER,
  // // })
  // @Public()
  // @Post('login')
  // @ApiOperation({ summary: 'Login and get tokens' })
  // @ApiBody({ type: LogupDto })
  // @Header('Content-Type', 'application/json')
  // async login(@Body() dto: LogupDto): Promise<LoginResponseDto> {
  //   try {
  //     const user = await this.authService.validateUser(dto.email, dto.password);
  //     if (!user) {
  //       throw new Error(DefaultErrorCodes.INVALID_CREDENTIALS);
  //     }

  //     const tokens = await this.authService.login({
  //       email: dto.email,
  //       password: dto.password,
  //       token: dto.token,
  //     } as LogupDto);

  //     return Promise.resolve({
  //       ...tokens,
  //       user: {
  //         email: user.email,
  //       },
  //     } as LoginResponseDto);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // // @Throttle({
  // //   auth: ThrottlersUtil.AUTH_DEFAULT_THROTTLER,
  // // })
  // @Post('is-token-valid')
  // @ApiOperation({ summary: 'Validate token by input' })
  // @ApiBody({ type: IsTokenValidDto })
  // @Header('Content-Type', 'application/json')
  // async isTokenValid(
  //   @Body() dto: IsTokenValidDto,
  // ): Promise<{ valid: boolean }> {
  //   return Promise.resolve({ valid: true });
  // }

  // // @Throttle({
  // //   auth: ThrottlersUtil.AUTH_DEFAULT_THROTTLER,
  // // })
  // @Public()
  // @Post('is-user-active')
  // @ApiOperation({ summary: 'Check if user is active by email' })
  // @ApiBody({ type: IsUserActiveDto })
  // @Header('Content-Type', 'application/json')
  // async isUserActive(
  //   @Body() dto: IsUserActiveDto,
  // ): Promise<{ active: boolean }> {
  //   return Promise.resolve({ active: true });
  // }

  // //generate otp code using string util then save it in notification_emails
  // // @Throttle({
  // //   otp: ThrottlersUtil.OTP_THROTTLER,
  // // })
  // @Public()
  // @Post('otp')
  // @ApiOperation({ summary: 'Generate OTP code for email verification' })
  // @ApiBody({ type: IsUserDto })
  // @Header('Content-Type', 'application/json')
  // async generateOtp(
  //   @Body() dto: IsUserDto,
  //   @Req() req: Request,
  // ): Promise<{ token: string }> {
  //   try {
  //     const tracker = `${dto.email}_otp_request`;
  //     (req as any).throttler = {
  //       tracker,
  //     };
  //     // Mock OTP generation
  //     const result = await this.authService.generateOtp(dto);
  //     return Promise.resolve(result);
  //   } catch (error) {
  //     throw new Error(`OTP generation failed: ${error.message}`);
  //   }
  // }

  // // @Throttle({
  // //   auth: ThrottlersUtil.AUTH_DEFAULT_THROTTLER,
  // // })
  // @Post('refresh')
  // @ApiOperation({ summary: 'Get a new access token using a refresh token' })
  // @ApiBody({ type: RefreshTokenDto })
  // @Header('Content-Type', 'application/json')
  // async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<{
  //   access_token: string;
  //   refresh_token: string;
  //   expires_at: Date;
  // }> {
  //   try {
  //     return this.authService.refreshToken(refreshTokenDto);
  //   } catch (error) {
  //     throw error; // Let the global exception filter handle it
  //   }
  // }

  // //logout
  // // @Throttle({
  // //   auth: ThrottlersUtil.AUTH_DEFAULT_THROTTLER,
  // // })
  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      throw error;
    }
  }
}
