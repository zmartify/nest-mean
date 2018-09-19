import { ApiModelProperty } from '@nestjs/swagger';
import { Ref } from '@aljazerzen/typegoose';
import { Openhab } from 'openhab/models/openhab.model';

export class RequestLogParams {
    @ApiModelProperty()
    requestId: number;
    @ApiModelProperty()
    url: string;
    @ApiModelProperty()
    openhab: Ref<Openhab>;
    @ApiModelProperty()
    requestReceived: Date;
    @ApiModelProperty()
    requestSent: Date;
    @ApiModelProperty()
    responseReceived: Date;
    @ApiModelProperty()
    responseSent: Date;
    @ApiModelProperty()
    responseStatus: number;
}
