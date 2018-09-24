import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account } from './models/account.model';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { OpenhabModule } from 'openhab/openhab.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Account.modelName, schema: Account.model.schema }]),
    OpenhabModule],
    controllers: [AccountController],
    providers: [AccountService],
    exports: [AccountService],
})
export class AccountModule {
}
