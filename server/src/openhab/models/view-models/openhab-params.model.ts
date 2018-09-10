import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { OpenhabStatus } from 'shared/enums/openhab-status.enum';

export class OpenhabParams {
    @ApiModelProperty() name: string;
    @ApiModelPropertyOptional({ enum: OpenhabStatus, example: OpenhabStatus.Offline })
    level?: OpenhabStatus;
}
