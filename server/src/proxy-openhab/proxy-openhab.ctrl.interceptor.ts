import { OpenhabService } from 'openhab/openhab.service';
import { InstanceType } from '@aljazerzen/typegoose';
import { Injectable, NestInterceptor, ExecutionContext, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from 'user/models/user.model';

export interface Response<T> {
    data: T;
}

const logger = Logger;

const CLASSNAME = 'ProxyOpenhabInterceptor';

@Injectable()
export class ProxyOpenhabCtrlInterceptor<T> implements NestInterceptor {

    constructor(private _openhabService: OpenhabService) {
    }
    intercept(
        context: ExecutionContext,
        call$: Observable<any>,
    ): Observable<any> {

        const request = context.switchToHttp().getRequest();

        const user: InstanceType<User> = request.user;
        const uuid: string = request.query.uuid;

        logger.log('Authorizing incoming openHAB connection', CLASSNAME);

        logger.log('(1)->' + JSON.stringify(user, null, 2));
        if (uuid) logger.log('(2)->' + uuid);

        // logger.log(JSON.stringify(client.handshake, null, 2), CLASSNAME);

        return call$;
    }
}
