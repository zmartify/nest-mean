import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Openhab } from 'openhab/models/openhab.model';
import { Ref } from '@aljazerzen/typegoose';

export class ItemParams {
    @ApiModelProperty() openhab: Ref<Openhab>;
    @ApiModelProperty() name: string;
    @ApiModelProperty() status: string;
}
