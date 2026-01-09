import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { NotificationEmailsService } from '../notification_emails/notification_emails.service';
import { CreateAuthTokensDto } from '../auth_tokens/dto/create-auth_tokens.dto';
import { AuthTokensService } from '../auth_tokens/auth_tokens.service';
import { DefaultErrorCodes } from '../error_codes/default_error_codes';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UsersService } from '../users/users.service';
import { LogupDto } from './dto/logup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authTokensService: AuthTokensService,
    private readonly usersService: UsersService,
    private readonly notificationEmailsService: NotificationEmailsService,
    private readonly cls: ClsService,
  ) {}
  private readonly saltRounds = 10;

  getJwtExpirationDate(exp: string): Date {
    const regex = /^(\d+)([smhd])$/; // supports s, m, h, d
    const match = exp.match(regex);

    if (!match) {
      throw new Error(`Invalid JWT expiration format: "${exp}"`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    let seconds = 0;

    switch (unit) {
      case 's':
        seconds = value;
        break;
      case 'm':
        seconds = value * 60;
        break;
      case 'h':
        seconds = value * 60 * 60;
        break;
      case 'd':
        seconds = value * 60 * 60 * 24;
        break;
      default:
        throw new Error(`Unsupported unit "${unit}"`);
    }

    const ms = seconds * 1000;
    return new Date(Date.now() + ms);
  }

  private async generateTokens(payload: { email: string }) {
    const accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      this.configService.get<string>('JWT_SECRET_KEY');
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || accessSecret;
    const accessExpiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ||
      this.configService.get<string>('JWT_EXPIRES_IN') ||
      '1h';
    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ||
      accessExpiresIn;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn as any,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: this.getJwtExpirationDate(accessExpiresIn),
    };
  }

  private async verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  private async verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  async findUserByEmail(email: string) {
    const result = await this.usersService.findOneBy('email', email);
    return Promise.resolve(result);
  }

  async validateUser(email: string, inputPassword: string) {
    const user = await this.usersService.findOneBy('email', email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(
      inputPassword,
      user.password as string,
    );
    return isMatch ? user : null;
  }

  async hashString(plain: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(plain, salt);
  }

  //generate tokens for user
  async login(dto: LogupDto): Promise<LoginResponseDto> {
    const user = await this.findUserByEmail(dto.email);
    if (!user) {
      throw new Error(DefaultErrorCodes.NOT_FOUND);
    }
    // Here you would typically generate JWT tokens or similar
    const { access_token, refresh_token, expires_at } =
      await this.generateTokens({
        email: user.email,
      });

    const findByToken = await this.notificationEmailsService.findOneBy(
      'token',
      dto.token,
    );
    if (!findByToken) {
      throw new Error(DefaultErrorCodes.INVALID_OTP_VERIFICATION);
    }
    if (new Date(findByToken.expiration_time).getTime() <= Date.now()) {
      throw new Error(DefaultErrorCodes.TOKEN_EXPIRED);
    }
    const isMatch = await bcrypt.compare(
      dto.passwordPlain || dto.password,
      user.password as string,
    );

    if (!isMatch) {
      throw new Error(DefaultErrorCodes.INVALID_OTP);
    }
    const date = new Date();
    // Save tokens to the database
    await this.authTokensService.create({
      user: user.id,
      jwt: access_token,
      expires_at,
      fingerprint: this.cls.get('fingerprint'),
      created_at: date,
      updated_at: date,
      created_by: this.usersService.getSystemId(),
      updated_by: this.usersService.getSystemId(),
    } as CreateAuthTokensDto);
    await this.usersService.update(user.id, {
      password: await this.hashString(uuidv4()), // Update password with OTP
    });
    return {
      access_token,
      refresh_token,
      // user: {
      //   email: user.email,
      //   password: '',
      //   full_name: '',
      //   created_at: undefined,
      //   created_by: '',
      //   updated_at: undefined,
      //   updated_by: '',
      //   mobile_number: '',
      //   blocked: user.blocked,
      //   // user_type: UserTypeEnum.INDIVIDUAL,
      //   // verification_status: VerificationStatusEnum.NOT_VERIFIED,
      //   active: user.active,
      //   deleted_at: 0,
      //   super_user: '',
      // },
    };
  }

  // Create a new user
  async create(signupDto: LogupDto): Promise<LoginResponseDto> {
    throw new Error('Sign up is disabled');
    // const date = new Date();
    // if (!signupDto.password) {
    //   signupDto.password = StringUtil.generateRandomHexString(16);
    // }
    // if (!StringUtil.isBcryptHash(signupDto.password)) {
    //   signupDto.password = await this.hashString(signupDto.password);
    // }
    // await this.usersService.create({
    //   email: signupDto.email,
    //   password: signupDto.password, // Ensure to hash the password before saving
    //   created_at: date,
    //   updated_at: date,
    //   created_by: this.usersService.getSystemId(),
    //   updated_by: this.usersService.getSystemId(),
    //   full_name: 'Empty',
    //   username: signupDto.email,
    //   mobile_number: '', // or signupDto.mobile_number if available
    //   user_type: UserTypeEnum.INDIVIDUAL,
    //   verification_status: VerificationStatusEnum.NOT_VERIFIED, // or appropriate value
    //   active: true, // or true if needed
    //   blocked: false, // or appropriate value
    //   deleted_at: 0, // or appropriate value
    // } as CreateUsersDto);
    // return Promise.resolve(await this.login(signupDto));
  }

  // async generateOtp(dto: IsUserDto) {
  //   const otp = StringUtil.generateRandomNumber(6); //'111111'; //
  //   const token = StringUtil.generateRandomHexString(128);
  //   const date = new Date();
  //   const isUser = await this.findUserByEmail(dto.email);
  //   await this.notificationEmailsService
  //     .getRepo()
  //     .delete({ to_direct: dto.email } as FindOptionsWhere<NotificationEmails>);
  //   const emailTemplate = FileHelper.readTemplateFile('views/otp.template.hbs');
  //   const email = await this.notificationEmailsService.create(
  //     DtoUtil.convertToEntity(NotificationEmails, {
  //       subject: `Your OTP Code at ${DateWrapper.formatDate(new Date(), 'DD/MM/YYYY HH:mm')}`,
  //       message: emailTemplate
  //         .replace('{{otp}}', otp)
  //         .replace('{{name}}', isUser ? isUser.full_name : dto.email)
  //         .replace(
  //           '{{date}}',
  //           DateWrapper.formatDate(new Date(), 'DD/MM/YYYY HH:mm'),
  //         ),
  //       to_direct: dto.email,
  //       expiration_time: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiration
  //       attachments: {
  //         logo: {
  //           filename: 'logo.jpg',
  //           encoding: 'base64',
  //           content: FileHelper.readAsBase64('views/logo.jpg'), // local path to the image
  //           cid: 'logo', // the same as in `cid:logo`
  //         },
  //       } as DataObject,
  //       token,
  //       created_at: date,
  //       updated_at: date,
  //       created_by: this.notificationEmailsService
  //         .getClsService()
  //         .get('systemId'),
  //       updated_by: this.notificationEmailsService
  //         .getClsService()
  //         .get('systemId'),
  //     } as CreateNotificationEmailsDto),
  //   );
  //   if (!isUser) {
  //     await this.create({
  //       email: dto.email,
  //       passwordPlain: otp,
  //       password: await this.hashString(otp), // Use OTP as a temporary password
  //       token: email.token,
  //     } as LogupDto);
  //   } else {
  //     await this.usersService.update(isUser.id, {
  //       password: await this.hashString(otp), // Update password with OTP
  //     });
  //   }
  //   return Promise.resolve({ token });
  // }

  /**
   * Verifies a refresh token and issues a new pair of access and refresh tokens.
   * @param refreshTokenDto - The DTO containing the refresh token.
   * @returns A new set of tokens.
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
    access_token: string;
    refresh_token: string;
    expires_at: Date;
  }> {
    try {
      // 1. Verify the refresh token
      const payload = await this.verifyRefreshToken(
        refreshTokenDto.refreshToken,
      );

      // 2. Check if the user from the token still exists
      const user = await this.findUserByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException(DefaultErrorCodes.INVALID_AUTH);
      }

      // 3. Generate and return a new pair of tokens
      return this.generateTokens({ email: user.email });
    } catch (error) {
      // Catches errors from verifyRefreshToken (e.g., expired or malformed token)
      throw new UnauthorizedException(DefaultErrorCodes.INVALID_AUTH);
    }
  }

  //logout
  async logout(): Promise<boolean> {
    try {
      // return await this.authTokensService.deleteByUserId();
      return true;
    } catch (error) {
      throw error;
    }
  }
}
