import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from 'shared/base.model';
import { Ref } from 'typegoose';
import { Openhab } from 'openhab/models/openhab.model';

export class EventVm extends BaseModelVm {
    @ApiModelProperty() openhab: Ref<Openhab>;
    @ApiModelProperty() source: string;
    @ApiModelProperty() oldStatus: string;
    @ApiModelProperty() status: string;
    @ApiModelProperty() numericStatus: number;
    @ApiModelProperty() oldNumericStatus: number;
    @ApiModelProperty() color: string;
    @ApiModelProperty() when: Date;
}
