import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account } from './models/account';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Account.modelName, schema: Account.model.schema }])],
    controllers: [AccountController],
    providers: [AccountService],
    exports: [AccountService],
})
export class AccountModule {
}
