import { Openhab } from 'openhab/models/openhab.model';
import { InstanceType, ModelType, pre, prop, Typegoose, Ref } from 'typegoose';
import { schemaOptions } from 'shared/base.model';

@pre<RequestLog>('findOneAndUpdate', function(next) {
    this._update.updatedAt = new Date(Date.now());
    next();
})
export class RequestLog extends Typegoose {
    @prop()
    id: number;                 // Request uniq id
    @prop()
    url: string;                // Request url
    @prop({ ref: Openhab, required: true})
    openhab: Ref<Openhab>;      // openHAB of the request
    @prop()
    requestReceived: Date;      // when request was received from mobile app
    @prop()
    requestSent: Date;          // when request was sent to openHAB
    @prop()
    responseReceived: Date;     // when response to request was received from openHAB
    @prop()
    responseSent: Date;         // when response to request was sent to mobile app
    @prop()
    responseStatus: number;      // Response HTTP response code

    static get model(): ModelType<RequestLog> {
        return new RequestLog().getModelForClass(RequestLog, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    static createModel(): InstanceType<RequestLog> {
        return new this.model();
    }
}

export const RequestLogModel = new RequestLog().getModelForClass(RequestLog, { schemaOptions });
