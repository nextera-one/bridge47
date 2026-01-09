import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { from, Observable, throwError } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

import { CreateLogsDto } from '../../logs/dto/create-logs.dto';
import { UpdateLogsDto } from '../../logs/dto/update-logs.dto';
import { TypeEnum } from '../../logs/enums/type.enum';
import { LevelEnum } from '../../logs/enums/level.enum';
import { LogsService } from '../../logs/logs.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly systemId: string;

  constructor(
    private readonly logsService: LogsService,
    private readonly cls: ClsService,
    private readonly configService: ConfigService,
  ) {
    this.systemId = this.configService.get<string>('SYSTEM_ID');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return this.cls.run(() => {
      const req = context.switchToHttp().getRequest();
      const { method, url } = req;
      const start = Date.now();

      const date = new Date();
      const dto: CreateLogsDto = {
        request: {
          method,
          path: url,
        },
        created_at: date,
        updated_at: date,
        created_by: this.cls.get('userId') || this.systemId,
        updated_by: this.cls.get('userId') || this.systemId,
        response: null,
        errors: null,
        duration: 0,
        status: 'started',
        content: undefined,
        type: TypeEnum.REQ,
        ts: date,
        action: req.route?.path || url,
        user: this.cls.get('userId') || this.systemId,
        entity_type: req.route?.path ? req.route.path.split('/')[1] : 'unknown',
        entity_id: req.params?.id || null,
        ip:
          req.ip ||
          req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          null,
        user_agent: req.headers['user-agent'] || null,
        system_id: this.systemId,
        logId: undefined,
        msg_short: '',
        status_code: 0,
        ip_address:
          req.ip ||
          req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          null,
        kver: '',
        level: LevelEnum.Info,
        source: 'http',
        context: req.route?.path || url,
        message: 'Request received',
        meta: {},
      };
      return from(this.logsService.create(dto)).pipe(
        mergeMap((log) => {
          this.cls.set('logId', (log as any).id);
          this.cls.set('systemId', this.systemId);
          req.logId = (log as any).id;

          return next.handle().pipe(
            tap((data) => {
              const duration = Date.now() - start;
              this.logsService.update((log as any).id, {
                status: 'success',
                duration,
                // response: data,
              } as UpdateLogsDto);
            }),
            catchError((err) => {
              const duration = Date.now() - start;
              this.logsService.update((log as any).id, {
                status: 'error',
                duration,
                errors: { message: err.message },
              } as UpdateLogsDto);
              return throwError(() => err);
            }),
          );
        }),
      );
    });
  }
}
