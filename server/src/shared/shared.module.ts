import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/strategies/jwt-strategy.service';
import { ConfigurationService } from './configuration/configuration.service';
import { MapperService } from './mapper/mapper.service';
import { ProxyOpenhabGateway } from './proxy-openhab/proxy-openhab.gateway';

@Global()
@Module({
    providers: [ConfigurationService, MapperService, AuthService, JwtStrategy, ProxyOpenhabGateway],
    exports: [ConfigurationService, MapperService, AuthService, ProxyOpenhabGateway],
    imports: [UserModule],
})

export class SharedModule {
}
