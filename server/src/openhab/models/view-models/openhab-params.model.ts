import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { OpenhabStatus } from 'shared/enums/openhab-status.enum';

export class OpenhabParams {
    @ApiModelPropertyOptional() name: string;   // A meaningful name of openHAB
    @ApiModelProperty() uuid: string;           // openHAB generated UUID
    @ApiModelProperty() secret: string;         // openHAB generated secret
    @ApiModelPropertyOptional({ enum: OpenhabStatus, example: OpenhabStatus.Offline })
    level?: OpenhabStatus;
}
