import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './shared/configuration/configuration.enum';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { SharedModule } from './shared/shared.module';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { OpenhabModule } from 'openhab/openhab.module';
import { AccountModule } from 'account/account.module';
import { EventModule } from 'event/event.module';
import { AccessLogModule } from 'access-log/access-log.module';
import { OpenhabAccessLogModule } from 'openhab-access-log/openhab-access-log.module';
import { RequestLogModule } from 'request-log/request-log.module';
import { ProxyOpenhabModule } from 'proxy-openhab/proxy-openhab.module';

@Module({
    imports: [SharedModule, MongooseModule.forRoot(ConfigurationService.connectionString, {
        retryDelay: 500,
        retryAttempts: 3,
    }), UserModule, AccessLogModule, EventModule, RequestLogModule, OpenhabAccessLogModule, TodoModule, OpenhabModule,
    AccountModule, ProxyOpenhabModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    static host: string;
    static port: number | string;
    static isDev: boolean;

    constructor(private readonly _configurationService: ConfigurationService) {
        AppModule.port = AppModule.normalizePort(_configurationService.get(Configuration.PORT));
        AppModule.host = _configurationService.get(Configuration.HOST);
        AppModule.isDev = _configurationService.isDevelopment;
    }

    private static normalizePort(param: number | string): number | string {
        const portNumber: number = typeof param === 'string' ? parseInt(param, 10) : param;
        if (isNaN(portNumber)) return param;
        else if (portNumber >= 0) return portNumber;
    }
}
