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
import { OpenhabService } from 'openhab/openhab.service';
import { OpenhabAccessLogService } from 'openhab-access-log/openhab-access-log.service';
import { EventService } from 'event/event.service';
import { ConfigurationService } from '../shared/configuration/configuration.service';
import { EventColor, OpenhabStatus } from '../shared/enums';
import { Logger, UseInterceptors, UsePipes } from '@nestjs/common';
import { ProxyOpenhabGWInterceptor } from './proxy-openhab.gw.interceptor';
import { ProxyOpenhabHandshakePipe } from './proxy-openhab.handshake.pipe';
import { ItemService } from 'item/item.service';

const logger = Logger;

const CLASSNAME = 'ProxyOpenhabGateway';

@UseInterceptors(ProxyOpenhabGWInterceptor)
// @UsePipes(new ProxyOpenhabHandshakePipe())
@WebSocketGateway()
export class ProxyOpenhabGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;

    offlineOpenhabs: any[] = [];
    internalAddress: string;

    constructor(
        private _configurationService: ConfigurationService,
        private _itemService: ItemService,
        private _eventService: EventService,
        private _openhabService: OpenhabService,
        private _openhabAccessLogService: OpenhabAccessLogService) {

        this.internalAddress = this._configurationService.internalAddress;
        logger.log('loaded....', CLASSNAME);
    }

    @SubscribeMessage('events')
    async message(client: any, num: any): Promise<boolean> {
        logger.log('Received ' + num);
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

    @SubscribeMessage('connection') connectionnotification(client, data): WsResponse<void> {
        logger.log('connection');
        return;
    }

    @SubscribeMessage('connect') connectnotification(client, data): WsResponse<void> {
        logger.log('connect');
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

    @SubscribeMessage('itemupdate') async itemUpdate(client, data): Promise<WsResponse<void>> {
        // if openhabId is missing then user has not completed auth
        if (client.openhabId === undefined) {
            return;
        }

        const itemName = data.itemName;
        const itemStatus = data.itemStatus;

        // Find openhab
        if (itemStatus && itemStatus.length > 100) {
            logger.log('openHAB-cloud: Item ' + itemName + ' status.length (' + (itemStatus ? itemStatus.length : 'null') +
                ') is too big or null, ignoring update', CLASSNAME);
            return;
        }

        let openhab: any = {};
        try {
            openhab = await this._openhabService.findById(client.openhabId);
            if (!openhab) {
                logger.log('Unable to find openHAB for itemUpdate: openHAB doesn\'t exist', CLASSNAME);
                return;
            }
        } catch (error) {
            logger.warn('Unable to find openHAB for itemUpdate: ' + error, CLASSNAME);
            return;
        }

        let itemToUpdate: any = {};
        try {
            itemToUpdate = await this._itemService.findOne({
                openhab: openhab.id,
                name: itemName,
            });

            // If no item found for this openhab with this name, create a new one
            if (!itemToUpdate) {
                logger.log('Item ' + itemName + ' for openHAB ' + openhab.uuid + ' not found, creating new one', CLASSNAME);
                itemToUpdate = await this._itemService.createItem({
                    openhab: openhab.id,
                    name: itemName,
                    status: '',
                });
            }
        } catch (error) {
            if (error) {
                logger.warn('openHAB-cloud: Unable to find item for itemUpdate: ' + error);
            }
            return;
        }

        // If item status changed, update item and create new item status change event
        if (itemToUpdate.status !== itemStatus) {
            try {
                // Update previous status value
                itemToUpdate.prev_status = itemToUpdate.status;
                // Set new status value
                itemToUpdate.status = itemStatus;
                // Set last update timestamp to current time
                itemToUpdate.last_update = new Date();
                // Save the updated item
                const updated = await this._itemService.update(itemToUpdate.id, itemToUpdate);
                logger.log('Item updated = ' + itemStatus, CLASSNAME);
            } catch (error) {
                if (error) {
                    logger.warn('Unable to update item for itemUpdate: ' + error, CLASSNAME);
                }
                return;
            }
        }
    }

    @SubscribeMessage('updateconfig') updateConfig(client, data): WsResponse<void> {
        logger.log('updateconfig');
        return;
    }

    emitRequest(openHabUUID: any, request: any) {
        logger.log('emitRequest');
    }

    afterInit(server) {
        logger.log('websockets initialized', CLASSNAME);
    }

    async handleConnection(client) {
        const uuid = client.handshake.headers.uuid;
        const secret = client.handshake.headers.secret;
        const openhabVersion = client.handshake.headers.openhabversion;
        const clientVersion = client.handshake.headers.clientversion;

        logger.log('Incoming openHAB connection for uuid ' + uuid, CLASSNAME);

        // Remove openHAB from offline array if needed
        delete this.offlineOpenhabs[uuid];

        try {
            const openhab = await this._openhabService.findOne({ uuid });

            if (!openhab) {
                logger.warn('Unable to find openHAB ' + uuid, CLASSNAME);
                const oh = await this._openhabService.createOpenhab({ name: 'Stangsdal', uuid, secret });
                logger.log('->' + JSON.stringify(oh, null, 2));
            } else {
                logger.log('Connected openHAB with ' + uuid + ' successfully', CLASSNAME);
                // Make an openhabaccesslog entry anyway
                try {
                    await this._openhabAccessLogService.createOpenhabAccessLog({
                        openhab: openhab.id,
                        remoteHost: client.handshake.headers['x-forwarded-for'] || client.client.conn.remoteAddress,
                        remoteVersion: openhabVersion,
                        remoteClientVersion: clientVersion,
                    });
                } catch (error) {
                    logger.error('Error saving openHAB access log: ' + error, CLASSNAME);
                }

                // Make an event and notification only if openhab was offline
                // If it was marked online, means reconnect appeared because of my.oh fault
                // We don't want massive events and notifications when node is restarted
                logger.log('uuid ' + uuid + ' server address ' + openhab.serverAddress +
                    ' my address ' + this.internalAddress, CLASSNAME);
                if (openhab.status === OpenhabStatus.Offline || openhab.serverAddress !== this.internalAddress) {
                    openhab.status = OpenhabStatus.Online;
                    openhab.serverAddress = this.internalAddress;
                    openhab.last_online = new Date();
                    openhab.openhabVersion = openhabVersion;
                    openhab.clientVersion = clientVersion;
                    openhab.save((error) => {
                        if (error) {
                            logger.error('Error saving openHAB: ' + error, CLASSNAME);
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
                        logger.error('Error saving connect event: ' + error, CLASSNAME);
                    }
                    // TODO: notifyOpenHABStatusChange(openhab, 'online');
                } else {
                    openhab.openhabVersion = openhabVersion;
                    openhab.clientVersion = clientVersion;
                    openhab.save((error) => {
                        if (error) {
                            logger.error('Error saving openhab: ' + error, CLASSNAME);
                        }
                    });
                }
                client.openhabUuid = openhab.uuid;
                client.openhabId = openhab.id;
            }
        } catch (error) {
            logger.error('Error looking up openHAB: ' + JSON.stringify(error, null, 2), CLASSNAME);
            return;
        }
    }

    async handleDisconnect(client) {
        const uuid = client.handshake.headers.uuid;
        try {
            const openhab = await this._openhabService.findOne({ uuid });
            this.offlineOpenhabs[openhab.uuid] = Date.now();
            if (openhab) {
                openhab.status = OpenhabStatus.Offline;
                openhab.save((error) => {
                    if (error) {
                        logger.error('Error saving openhab: ' + error, CLASSNAME);
                    }
                });
            } else {
                logger.warn('Disconnected client: ' + uuid + ' doesn\'t exist', CLASSNAME);
            }
            logger.log('Disconnected ' + openhab.uuid, CLASSNAME);
        } catch (error) {
            logger.error('Disconnect: Client ' + uuid + ' not found', CLASSNAME);
        }
    }
}