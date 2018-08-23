import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/strategies/jwt-strategy.service';
import { ConfigurationService } from './configuration/configuration.service';
import { MapperService } from './mapper/mapper.service';
import { EventsGateway } from './events/events.gateway';

@Global()
@Module({
    providers: [ConfigurationService, MapperService, AuthService, JwtStrategy, EventsGateway],
    exports: [ConfigurationService, MapperService, AuthService, EventsGateway],
    imports: [UserModule],
})
export class SharedModule {
}
