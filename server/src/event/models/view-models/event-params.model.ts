import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Openhab } from 'openhab/models/openhab.model';
import { Ref } from 'typegoose';
import { EventColor, OpenhabStatus } from 'shared/enums';

export class EventParams {
    @ApiModelProperty() openhab: Ref<Openhab>;
    @ApiModelProperty() source: string;
    @ApiModelProperty({ enum: OpenhabStatus}) status?: OpenhabStatus;
    @ApiModelProperty() numericStatus?: number;
    @ApiModelProperty({ enum: EventColor }) color: EventColor;
}
