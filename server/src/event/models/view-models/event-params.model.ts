import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Openhab } from 'openhab/models/openhab.model';
import { Ref } from 'typegoose';

export class EventParams {
    @ApiModelProperty() openhab: Ref<Openhab>;
    @ApiModelProperty() source: string;
    @ApiModelProperty() oldStatus: string;
    @ApiModelProperty() status: string;
    @ApiModelProperty() numericStatus: number;
    @ApiModelProperty() oldNumericStatus: number;
    @ApiModelProperty() color: string;
    @ApiModelProperty() when: Date;
}
