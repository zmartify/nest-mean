import {
    WebSocketGateway,
    SubscribeMessage,
    WsResponse,
    WebSocketServer,
    WsException,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
} from '@nestjs/websockets';
import { SubscribeMessageWithAck } from 'nestjs-socket-handlers-with-ack';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;

    @SubscribeMessage('events')
    async message(client: any, num: number): Promise<boolean> {
        console.log(num);
        if (isNaN(num)) {
            throw new Error('Wrong number received');
        }
        return num % 2 === 1;
    }

    @SubscribeMessage('responseContentBinary')
    responseContentBinary(client, data): WsResponse<void> {
        return;
    }

    @SubscribeMessage('responseError')
    responseError(client, data): WsResponse<void> {
        return;
    }

    @SubscribeMessage('notification')
    notification(client, data): WsResponse<void> {
        return;
    }

    @SubscribeMessage('broadcastnotification')
    broadcastNotification(client, data): WsResponse<void> {
        return;
    }

    @SubscribeMessage('lognotification')
    logNotification(client, data): WsResponse<void> {
        return;
    }

    @SubscribeMessage('itemupdate')
    itemUpdate(client, data): WsResponse<void> {
        return;
    }

    @SubscribeMessage('updateconfig')
    updateConfig(client, data): WsResponse<void> {
        return;
    }

    afterInit(req) {
        console.log('websockets initialized');
    }

    handleConnection(req) {
        console.log('connect');
    }

    handleDisconnect(req) {
        console.log('disconnect');
    }
}