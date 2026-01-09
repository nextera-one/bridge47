import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CreateLogsDto } from '../../logs/dto/create-logs.dto';
import { TypeEnum } from '../../logs/enums/type.enum';
import { LevelEnum } from '../../logs/enums/level.enum';
import { LogsService } from '../../logs/logs.service';
import CurrentUserModel from '../../model/current_user.model';
import DtoUtil from '../utils/dto.util';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const path = req.path;
    const requestHeaders = req.headers;
    const requestBody = req.body;

    return next.handle().pipe(
      tap((response) => {
        const responseHeaders = response.headers;
        const responseBody = response.body;
        const dto: CreateLogsDto = {
          level: LevelEnum.Info,
          source: 'http-request',
          context: path,
          message: `${method} ${path}`,
          meta: {
             method,
             path,
             requestHeaders,
             requestBody,
             responseHeaders,
             responseBody,
          },
          created_at: undefined,
          created_by: '',
          updated_at: undefined,
          updated_by: '',
          request: undefined,
          response: undefined,
          errors: undefined,
          duration: 0,
          status: 'success',
          type: TypeEnum.REQ,
          ts: new Date(),
          action: '',
          user: '',
          entity_type: '',
          entity_id: '',
          entity: '',
          ip: req.ip || '',
          user_agent: req.headers['user-agent'] || '',
          session_id: req.sessionID || '',
          msg_short: '', 
          status_code: response?.statusCode ?? 0, 
          ip_address: req.ip || '', 
          kver: '', 
        };

        const finalDto = DtoUtil.overrideAuditColumns<CreateLogsDto>(
          dto,
          {} as CurrentUserModel,
        ) as CreateLogsDto;
        console.log(finalDto, '<---');

        this.logService.create(finalDto);
      }),
    );
  }
}
