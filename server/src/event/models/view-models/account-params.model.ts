import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { AccountLevel } from '../account-level.enum';

export class AccountParams {
    @ApiModelProperty() name: string;
    @ApiModelPropertyOptional({ enum: AccountLevel, example: AccountLevel.Free })
    level?: AccountLevel;
}
