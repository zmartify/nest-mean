import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { BaseService } from 'shared/base.service';
import { MapperService } from 'shared/mapper/mapper.service';
import { Account, AccountModel } from './models/account';
import { AccountParams } from './models/view-models/account-params.model';

@Injectable()
export class AccountService extends BaseService<Account> {
    constructor(
        @InjectModel(Account.modelName) private readonly _todoModel: ModelType<Account>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this._model = _todoModel;
        this._mapper = _mapperService.mapper;
    }

    async createAccount(params: AccountParams): Promise<Account> {
        const { content, level } = params;

        const newAccount = new AccountModel();

        newAccount.content = content;

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
