import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from 'shared/base.model';
import { Ref } from 'typegoose';
import { Openhab } from 'openhab/models/openhab.model';
import { OpenhabStatus, EventColor } from 'shared/enums';

export class EventVm extends BaseModelVm {
    @ApiModelProperty() openhab: Ref<Openhab>;
    @ApiModelProperty() source: string;
    @ApiModelProperty() oldStatus: string;
    @ApiModelProperty({ enum: OpenhabStatus}) status: OpenhabStatus;
    @ApiModelProperty() numericStatus: number;
    @ApiModelProperty() oldNumericStatus: number;
    @ApiModelProperty({ enum: EventColor }) color: EventColor;
    @ApiModelProperty() when: Date;
}
