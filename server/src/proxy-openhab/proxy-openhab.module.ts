import { Module } from '@nestjs/common';
import { ProxyOpenhabController } from './proxy-openhab.controller';
import { ProxyOpenhabGateway } from './proxy-openhab.gateway';
import { RequestTracker } from './request-tracker.service';

@Module({
    controllers: [ProxyOpenhabController],
    providers: [ProxyOpenhabGateway, RequestTracker],
})

export class ProxyOpenhabModule {
}
