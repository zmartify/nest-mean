import { Openhab } from 'openhab/models/openhab.model';
import { InstanceType, ModelType, pre, prop, index, Typegoose, arrayProp, Ref } from 'typegoose';
import { schemaOptions } from 'shared/base.model';

@pre<Item>('findOneAndUpdate', function(next) {
    this._update.updatedAt = new Date(Date.now());
    next();
})

export class States extends Typegoose {
    @prop() when: Date;
    @prop() value: string;
}

@index({ openhab: 1, name: 2}, { unique: true })
export class Item extends Typegoose {
    @prop({ ref: Openhab, required: true }) openhab: Ref<Openhab>;  // openHAB this item belongs to
    @prop() name: string;                           // Item name
    @prop() type: string;                           // Item type (Group, Switch, Number, etc)
    @prop() label: string;                          // Item label ("Dinner lights")
    @prop() groups: [Ref<Openhab>];                 // An array of ObjectIds of Group typed Items
    @prop() icon: string;                           // icon name for this item
    @prop() status: string;                         // Current Item status
    @prop() prev_status: string;                    // Previous status value
    @prop() last_update: Date;                      // Date/time of last Item status update
    @prop() last_change: Date;                      // Date/time of last Item change
    @arrayProp({ items: States }) states?: States[]; // We cache last X (50?) states of the item in this array
                                                     // in a form of {when: Date, value: String}, latest values first in array

    static get model(): ModelType<Item> {
        return new Item().getModelForClass(Item, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    static createModel(): InstanceType<Item> {
        return new this.model();
    }
}

export const ItemModel = new Item().getModelForClass(Item, { schemaOptions });
