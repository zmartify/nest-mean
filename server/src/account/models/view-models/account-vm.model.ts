import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from 'shared/base.model';
import { AccountLevel } from '../account-level.enum';
import { Ref } from 'typegoose';
import { User } from 'user/models/user.model';

export class AccountVm extends BaseModelVm {
    @ApiModelProperty() name: string;
    @ApiModelProperty({ enum: AccountLevel })
    level: AccountLevel;
    @ApiModelProperty()
    users: Ref<User>[];
    @ApiModelProperty()
    accounts: Ref<Account>[];
    @ApiModelProperty() isCompleted: boolean;
}
