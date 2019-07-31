import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Question } from './models/Question';

type Controllers = {
  [name: string]: { 
    [name: string]: {
      returnType: any;
    }
  }
}

const controllers: Controllers = {
    QuestionController: {
        getAddress: {
            returnType: Question
        },
    },
}

@Injectable()
export class RouteInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const method = controllers[context.getClass().name][context.getHandler().name];
    console.log(method);
    return next
      .handle();
  }
}