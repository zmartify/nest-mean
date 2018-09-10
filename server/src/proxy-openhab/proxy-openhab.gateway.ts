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
import { Logger } from '@nestjs/common';
import { RequestTracker } from './request-tracker.service';
import { OpenhabService } from 'openhab/openhab.service';
import { OpenhabAccessLogService } from 'openhab-access-log/openhab-access-log.service';
import { EventService } from 'event/event.service';
import { ConfigurationService } from '../shared/configuration/configuration.service';
import { EventColor, OpenhabStatus } from '../shared/enums';

const logger = Logger;

@WebSocketGateway()
export class ProxyOpenhabGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;

    offlineOpenhabs: any[] = [];
    internalAddress: string;

    constructor(
                private _configurationService: ConfigurationService,
                private _openhabService: OpenhabService,
                private _eventService: EventService,
                private _openhabAccessLogService: OpenhabAccessLogService) {

        this.internalAddress = this._configurationService.internalAddress;
    }

    @SubscribeMessage('events')
    async message(client: any, num: number): Promise<boolean> {
        // this.logger.log('Received ' + num);
        if (isNaN(num)) {
            throw new Error('Wrong number received');
        }
        return num % 2 === 1;
    }

    @SubscribeMessage('responseContentBinary') responseContentBinary(client, data): WsResponse<void> {
        logger.log('responseContentBinary');
        return;
    }

    @SubscribeMessage('responseError') responseError(client, data): WsResponse<void> {
        logger.log('responseError');
        return;
    }

    @SubscribeMessage('notification') notification(client, data): WsResponse<void> {
        logger.log('notification');
        return;
    }

    @SubscribeMessage('broadcastnotification') broadcastNotification(client, data): WsResponse<void> {
        logger.log('broadcastnotification');
        return;
    }

    @SubscribeMessage('lognotification') logNotification(client, data): WsResponse<void> {
        logger.log('lognotification');
        return;
    }

    @SubscribeMessage('itemupdate') itemUpdate(client, data): WsResponse<void> {
        logger.log('itemupdate');
        return;
    }

    @SubscribeMessage('updateconfig') updateConfig(client, data): WsResponse<void> {
        logger.log('updateconfig');
        return;
    }

    emitRequest(openHabUUID: any, request: any) {
        logger.log('emitRequest');
    }

    afterInit(server) {
        console.log('websockets initialized');
    }

    async handleConnection(socket) {
        logger.log('openHAB-cloud: Incoming openHAB connection for uuid ' + socket.handshake.uuid);
        socket.join(socket.handshake.uuid);

        // Remove openHAB from offline array if needed
        delete this.offlineOpenhabs[socket.handshake.uuid];

        try {
            const openhab = await this._openhabService.findOne({
                uuid: socket.handshake.uuid,
            });

            if (!openhab) {
                logger.warn('openHAB-cloud: Unable to find openHAB ' + socket.handshake.uuid);
            } else {
                logger.log('openHAB-cloud: Connected openHAB with ' + socket.handshake.uuid + ' successfully');
                // Make an openhabaccesslog entry anyway
                try {
                    await this._openhabAccessLogService.createOpenhabAccessLog({
                        openhab: openhab.id,
                        remoteHost: socket.handshake.headers['x-forwarded-for'] || socket.client.conn.remoteAddress,
                        remoteVersion: socket.handshake.openhabVersion,
                        remoteClientVersion: socket.handshake.clientVersion,
                    });
                } catch (error) {
                    logger.error('openHAB-cloud: Error saving openHAB access log: ' + error);
                }

                // Make an event and notification only if openhab was offline
                // If it was marked online, means reconnect appeared because of my.oh fault
                // We don't want massive events and notifications when node is restarted
                logger.log('openHAB-cloud: uuid ' + socket.handshake.uuid + ' server address ' + openhab.serverAddress +
                    ' my address ' + this.internalAddress);
                if (openhab.status === OpenhabStatus.Offline || openhab.serverAddress !== this.internalAddress) {
                    openhab.status = OpenhabStatus.Online;
                    openhab.serverAddress = this.internalAddress;
                    openhab.last_online = new Date();
                    openhab.openhabVersion = socket.handshake.openhabVersion;
                    openhab.clientVersion = socket.handshake.clientVersion;
                    openhab.save((error) => {
                        if (error) {
                            logger.error('openHAB-cloud: Error saving openHAB: ' + error);
                        }
                    });
                    try {
                        await this._eventService.createEvent({
                            openhab: openhab.id,
                            source: 'openhab',
                            status: OpenhabStatus.Online,
                            color: EventColor.Good,
                        });
                    } catch (error) {
                        logger.error('openHAB-cloud: Error saving connect event: ' + error);
                    }
                    // TODO: notifyOpenHABStatusChange(openhab, 'online');
                } else {
                    openhab.openhabVersion = socket.handshake.openhabVersion;
                    openhab.clientVersion = socket.handshake.clientVersion;
                    openhab.save(function(error) {
                        if (error) {
                            this.logger.error('openHAB-cloud: Error saving openhab: ' + error);
                        }
                    });
                }
                socket.openhabUuid = openhab.uuid;
                socket.openhabId = openhab.id;
            }
        } catch (error) {
            logger.error('openHAB-cloud: Error looking up openHAB: ' + error);
            return;
        }

        logger.log('connect');
    }

    handleDisconnect(client) {
        logger.log('disconnect');
    }
}