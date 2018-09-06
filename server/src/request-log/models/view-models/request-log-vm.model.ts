import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from 'shared/base.model';
import { Ref } from 'typegoose';
import { Openhab } from 'openhab/models/openhab.model';

export class RequestLogVm extends BaseModelVm {
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
