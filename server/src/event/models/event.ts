import { Openhab } from 'openhab/models/openhab.model';
import { InstanceType, ModelType, pre, prop, Typegoose, arrayProp, Ref } from 'typegoose';
import { schemaOptions } from 'shared/base.model';
import { User } from 'user/models/user.model';

@pre<Event>('findOneAndUpdate', function(next) {
    this._update.updatedAt = new Date(Date.now());
    next();
})
export class Event extends Typegoose {
    @arrayProp({ itemsRef: Openhab })
    openhabs: Ref<Openhab>[];
    @prop()
    source: string;
    @prop()
    oldStatus: string;
    @prop()
    status: string;
    @prop()
    numericStatus: number;
    @prop()
    oldNumericStatus: number;
    @prop()
    color: string;
    @prop({ default: Date.now(), expires: '14d' })
    when: Date;

    static get model(): ModelType<Event> {
        return new Event().getModelForClass(Event, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    static createModel(): InstanceType<Event> {
        return new this.model();
    }
}

export const EventModel = new Event().getModelForClass(Event, { schemaOptions });
