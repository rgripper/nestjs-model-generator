import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Company } from './models/Company';
import { RecursiveModel } from './models/RecursiveModel';

type RouteControllers = {
  [name: string]: { 
    [name: string]: {
      returnType: any;
    }
  }
}

const controllers: RouteControllers = {
    CompanyController: {
        getCompany: {
            returnType: Company
        },
    },
    RecursiveModelController: {
        getRecursiveModel: {
            returnType: RecursiveModel
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