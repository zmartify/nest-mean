import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Openhab } from 'openhab/models/openhab.model';
import { Ref } from 'typegoose';
import { OpenhabStatus } from 'shared/enums';

export class ItemParams {
    @ApiModelProperty() openhab: Ref<Openhab>;
    @ApiModelProperty() name: string;
}
