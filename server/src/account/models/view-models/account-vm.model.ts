import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from 'shared/base.model';
import { AccountLevel } from '../account-level.enum';
import { Ref } from '@aljazerzen/typegoose';
import { User } from 'user/models/user.model';
import { Openhab } from 'openhab/models/openhab.model';

export class AccountVm extends BaseModelVm {
    @ApiModelProperty() name: string;
    @ApiModelProperty({ enum: AccountLevel }) level: AccountLevel;
    @ApiModelProperty() users: Ref<User>[];
    @ApiModelProperty() openhabs: Ref<Openhab>[];
    @ApiModelProperty() isActive: boolean;
}
