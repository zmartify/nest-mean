import { OpenhabService } from 'openhab/openhab.service';

import { Injectable, NestInterceptor, ExecutionContext, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Response<T> {
    data: T;
}

const logger = Logger;

const CLASSNAME = 'ProxyOpenhabInterceptor';

@Injectable()
export class ProxyOpenhabGWInterceptor<T> implements NestInterceptor {

    constructor(private _openhabService: OpenhabService) {
    }
    intercept(
        context: ExecutionContext,
        call$: Observable<any>,
    ): Observable<any> {
        const client = context.switchToWs().getClient();
        const handshakeData = client.handshake;

        logger.log('Authorizing incoming openHAB connection', CLASSNAME);

        handshakeData.uuid = handshakeData.query['uuid'];
        handshakeData.openhabVersion = handshakeData.query['openhabVersion'];
        handshakeData.clientVersion = handshakeData.query['clientVersion'];
        let handshakeSecret = handshakeData.query['secret'];
        if (!handshakeData.uuid) {
            handshakeData.uuid = handshakeData.headers['uuid'];
            handshakeSecret = handshakeData.headers['secret'];
            handshakeData.openhabVersion = handshakeData.headers['openhabversion'];
            handshakeData.clientVersion = handshakeData.headers['clientversion'];
        }
        if (!handshakeData.openhabVersion) {
            handshakeData.openhabVersion = 'unknown';
        }
        if (!handshakeData.clientVersion) {
            handshakeData.clientVersion = 'unknown';
        }
        // logger.log(JSON.stringify(client.handshake, null, 2), CLASSNAME);

        return call$;
    }
}
