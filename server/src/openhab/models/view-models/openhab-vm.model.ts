import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from 'shared/base.model';
import { OpenhabStatus } from 'shared/enums/openhab-status.enum';

export class OpenhabVm extends BaseModelVm {
    @ApiModelProperty() name: string;
    @ApiModelProperty() openhabVersion: string;
    @ApiModelProperty() clientVersion: string;
    @ApiModelProperty({ enum: OpenhabStatus })
    level: OpenhabStatus;
}
