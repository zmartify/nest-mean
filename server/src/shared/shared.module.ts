import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/strategies/jwt-strategy.service';
import { ConfigurationService } from './configuration/configuration.service';
import { MapperService } from './mapper/mapper.service';
import { ProxyOpenhabModule } from './proxy-openhab/proxy-openhab.module';

@Global()
@Module({
    providers: [ConfigurationService, MapperService, AuthService, JwtStrategy],
    exports: [ConfigurationService, MapperService, AuthService],
    imports: [UserModule, ProxyOpenhabModule],
})

export class SharedModule {
}
