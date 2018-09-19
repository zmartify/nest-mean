import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from 'shared/base.model';
import { Ref } from '@aljazerzen/typegoose';
import { Openhab } from 'openhab/models/openhab.model';

export class OpenhabAccessLogVm extends BaseModelVm {
    @ApiModelProperty()
    openhab: Ref<Openhab>;
    @ApiModelProperty()
    remoteHost: string;
    @ApiModelProperty()
    remoteVersion: string;
    @ApiModelProperty()
    remoteClientVersion: string;
    @ApiModelProperty()
    whenStarted?: Date;
    @ApiModelProperty()
    whenFinished?: Date;
}
