import { ApiModelProperty } from '@nestjs/swagger';
import { Ref } from 'typegoose';
import { Openhab } from 'openhab/models/openhab.model';

export class OpenhabAccessLogParams {
    @ApiModelProperty()
    openhab: Ref<Openhab>;
    @ApiModelProperty()
    remoteHost: string;
    @ApiModelProperty()
    remoteVersion: string;
    @ApiModelProperty()
    remoteClientVersion: string;
}
