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
import { Logger } from '@nestjs/common';
import { RequestTracker } from './request-tracker.service';

@WebSocketGateway()
export class ProxyOpenhabGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;

    constructor(private requestTracker: RequestTracker,
                private logger: Logger) {
    }

    @SubscribeMessage('events')
    async message(client: any, num: number): Promise<boolean> {
        // this.logger.log('Received ' + num);
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

    emitRequest(openHabUUID: any, request: any) {
    }

    afterInit(server) {
        console.log('websockets initialized');
    }

    handleConnection(socket) {
        this.logger.log('openHAB-cloud: Incoming openHAB connection for uuid ' + socket.handshake.uuid);
        socket.join(socket.handshake.uuid);
        // Remove openHAB from offline array if needed
        delete offlineOpenhabs[socket.handshake.uuid];
        Openhab.findOne({
            uuid: socket.handshake.uuid
        }, function (error, openhab) {
            if (!error && openhab) {
                logger.info('openHAB-cloud: Connected openHAB with ' + socket.handshake.uuid + ' successfully');
                // Make an openhabaccesslog entry anyway
                var remoteHost = socket.handshake.headers['x-forwarded-for'] || socket.client.conn.remoteAddress;
                var newOpenhabAccessLog = new OpenhabAccessLog({
                    openhab: openhab.id,
                    remoteHost: remoteHost,
                    remoteVersion: socket.handshake.openhabVersion,
                    remoteClientVersion: socket.handshake.clientVersion
                });
                newOpenhabAccessLog.save(function (error) {
                    if (error) {
                        logger.error('openHAB-cloud: Error saving openHAB access log: ' + error);
                    }
                });
                // Make an event and notification only if openhab was offline
                // If it was marked online, means reconnect appeared because of my.oh fault
                // We don't want massive events and notifications when node is restarted
                  logger.info('openHAB-cloud: uuid ' + socket.handshake.uuid + ' server address ' + openhab.serverAddress + " my address " + internalAddress);
                if (openhab.status === 'offline' || openhab.serverAddress !== internalAddress) {
                    openhab.status = 'online';
                    openhab.serverAddress = internalAddress;
                    openhab.last_online = new Date();
                    openhab.openhabVersion = socket.handshake.openhabVersion;
                    openhab.clientVersion = socket.handshake.clientVersion;
                    openhab.save(function (error) {
                        if (error) {
                            logger.error('openHAB-cloud: Error saving openHAB: ' + error);
                        }
                    });
                    var connectevent = new Event({
                        openhab: openhab.id,
                        source: 'openhab',
                        status: 'online',
                        color: 'good'
                    });
                    connectevent.save(function (error) {
                        if (error) {
                            logger.error('openHAB-cloud: Error saving connect event: ' + error);
                        }
                    });
                    notifyOpenHABStatusChange(openhab, 'online');
                } else {
                    openhab.openhabVersion = socket.handshake.openhabVersion;
                    openhab.clientVersion = socket.handshake.clientVersion;
                    openhab.save(function (error) {
                        if (error) {
                            logger.error('openHAB-cloud: Error saving openhab: ' + error);
                        }
                    });
                }
                socket.openhabUuid = openhab.uuid;
                socket.openhabId = openhab.id;
            } else {
                if (error) {
                    logger.error('openHAB-cloud: Error looking up openHAB: ' + error);
                } else {
                    logger.warn('openHAB-cloud: Unable to find openHAB ' + socket.handshake.uuid);
                }
            }
    



        console.log('connect');
    }

    handleDisconnect(client) {
        console.log('disconnect');
    }
}