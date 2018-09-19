import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from 'shared/base.model';
import { Ref } from '@aljazerzen/typegoose';
import { Openhab } from 'openhab/models/openhab.model';
import { States } from '../item.model';

export class ItemVm extends BaseModelVm {
    @ApiModelProperty() openhab: Ref<Openhab>;      // openHAB this item belongs to
    @ApiModelProperty() name: string;               // Item name
    @ApiModelProperty() type: string;               // Item type (Group, Switch, Number, etc)
    @ApiModelProperty() label: string;              // Item label ("Dinner lights")
    @ApiModelProperty() groups: [Ref<Openhab>];     // An array of ObjectIds of Group typed Items
    @ApiModelProperty() icon: string;               // icon name for this item
    @ApiModelProperty() status: string;             // Current Item status
    @ApiModelProperty() prev_status: string;        // Previous status value
    @ApiModelProperty() last_update: Date;          // Date/time of last Item status update
    @ApiModelProperty() last_change: Date;          // Date/time of last Item change
    @ApiModelProperty() states?: States[];          // We cache last X (50?) states of the item in this array
                                                     // in a form of {when: Date, value: String}, latest values first in array
}
