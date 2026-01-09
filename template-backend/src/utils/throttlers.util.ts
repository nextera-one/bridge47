import { seconds, ThrottlerOptions } from '@nestjs/throttler';

export class ThrottlersUtil {
  public static OTP_THROTTLER: ThrottlerOptions = {
    name: 'otp',
    limit: 100, //TODO: change it to 5 in production
    ttl: seconds(90),
  };
  public static DEFAULT_THROTTLER: ThrottlerOptions = {
    name: 'default',
    ttl: seconds(60),
    limit: 10,
  };
  public static AUTH_DEFAULT_THROTTLER: ThrottlerOptions = {
    name: 'auth',
    limit: 5,
    ttl: seconds(30),
  };
  public static SUBSCRIB_DEFAULT_THROTTLER: ThrottlerOptions = {
    name: 'subscribe',
    limit: 1,
    ttl: seconds(300),
  };
}
