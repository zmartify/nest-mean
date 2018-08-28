import { Module } from '@nestjs/common';
import { ProxyOpenhabGateway } from './proxy-openhab.gateway';

@Module({
    providers: [ProxyOpenhabGateway],
})

export class ProxyOpenhabModule {
}
