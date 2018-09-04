import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account } from './models/event';
import { AccountController } from './event.controller';
import { AccountService } from './event.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Account.modelName, schema: Account.model.schema }])],
    controllers: [AccountController],
    providers: [AccountService],
})
export class AccountModule {
}
