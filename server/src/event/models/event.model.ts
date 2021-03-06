import { Openhab } from 'openhab/models/openhab.model';
import { InstanceType, ModelType, pre, prop, Typegoose, arrayProp, Ref } from '@aljazerzen/typegoose';
import { schemaOptions } from 'shared/base.model';
import { EventColor } from 'shared/enums/event-color.enum';

@pre<Event>('findOneAndUpdate', function(next) {
    this._update.updatedAt = new Date(Date.now());
    next();
})
export class Event extends Typegoose {
    @prop({ ref: Openhab })
    openhab: Ref<Openhab>;
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
    @prop({ enum: EventColor })
    color: EventColor;
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
