import { OpenhabModule } from './../openhab/openhab.module';
import { EventModule } from './../event/event.module';
import { Module } from '@nestjs/common';
import { ProxyOpenhabController } from './proxy-openhab.controller';
import { ProxyOpenhabGateway } from './proxy-openhab.gateway';
import { RequestTracker } from './request-tracker.service';
import { OpenhabAccessLogModule } from 'openhab-access-log/openhab-access-log.module';
import { ItemModule } from 'item/item.module';
import { AccountModule } from 'account/account.module';

@Module({
    imports: [AccountModule, EventModule, ItemModule, OpenhabAccessLogModule, OpenhabModule ],
    controllers: [ProxyOpenhabController],
    providers: [ProxyOpenhabGateway, RequestTracker],
    exports: [ProxyOpenhabGateway],
})

export class ProxyOpenhabModule {
}
