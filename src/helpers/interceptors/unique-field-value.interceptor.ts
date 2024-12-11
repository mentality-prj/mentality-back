import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

import { errorsCode } from './errors-code';

@Injectable()
export class UniqueFieldValue implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err.code === errorsCode.duplicateFieldValue) {
          console.log('err.code :>> ', err.code);
          const duplicateField = Object.entries(err.keyValue).flat();
          console.log('duplicateField[1] :>> ', duplicateField[1]);
          const request = context.switchToHttp().getRequest();
          const method = request.method;
          const url = request.url;

          const errorMessage = `Unique constraint violation on field: '${duplicateField[0]}', value: '${duplicateField[1]}'. Error occurred on [${method}] ${url}'`;

          throw new BadRequestException(errorMessage);
        }
        throw err;
      }),
    );
  }
}
