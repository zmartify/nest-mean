import { ApiModelProperty } from '@nestjs/swagger';
import { Ref } from 'typegoose';
import { Openhab } from 'openhab/models/openhab.model';
import { User } from 'user/models/user.model';

export class AccessLogParams {
    @ApiModelProperty()
    openhab: Ref<Openhab>;
    @ApiModelProperty()
    user: Ref<User>;
    @ApiModelProperty()
    path: string;
    @ApiModelProperty()
    method: string;
    @ApiModelProperty()
    remoteHost: string;
    @ApiModelProperty()
    whenStarted?: Date;
    @ApiModelProperty()
    whenFinished?: Date;
}
