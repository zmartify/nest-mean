import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from '@aljazerzen/typegoose';
import { BaseService } from 'shared/base.service';
import { MapperService } from 'shared/mapper/mapper.service';
import { Account, AccountModel } from './models/account.model';
import { AccountParams } from './models/view-models/account-params.model';

@Injectable()
export class AccountService extends BaseService<Account> {
    constructor(
        @InjectModel(Account.modelName) private readonly _accountModel: ModelType<Account>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this._model = _accountModel;
        this._mapper = _mapperService.mapper;
    }

    async createAccount(params: AccountParams): Promise<Account> {
        const { name, level } = params;

        const newAccount = new AccountModel();

        newAccount.name = name;

        if (level) {
            newAccount.level = level;
        }

        try {
            const result = await this.create(newAccount);
            return result.toJSON() as Account;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
