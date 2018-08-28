import { InstanceType, ModelType, pre, prop, Typegoose } from 'typegoose';
import { schemaOptions } from 'shared/base.model';
import { OpenhabStatus } from './openhab-status.enum';

@pre<Openhab>('findOneAndUpdate', function(next) {
    this._update.updatedAt = new Date(Date.now());
    next();
})
export class Openhab extends Typegoose {
    @prop({ required: [true, 'Content is required'] })
    content: string;
    @prop({ default: false })
    isCompleted: boolean;

    @prop()
    name: string;                                       // A meaningfull name of openHAB
    @prop({ unique: true, required: [true, 'Uuid is required'] })
    uuid: string;                    // openHAB generated UUID
    @prop({ required: [true, 'Secret is required']})
    secret: string;                         // openHAB generated secret
    @prop()
    config: {};                             // openhab.cfg
    account: {};                      // An account openHAB belongs to
    @prop()
    openhabVersion: string;                 // openHAB version
    @prop()
    clientVersion: string;                  // openhab-cloud bundle version
    @prop()
    global_location: number[];              // openHAB's global location
    @prop()
    last_online: Date;                        // last seen this openHAB online
    @prop()
    last_email_notification: Date;              // last notification about openHAB being offline for long time
    @prop({ enum: OpenhabStatus, default: OpenhabStatus.Offline })
    status: OpenhabStatus;                      // current openHAB status (online/offline)
    @prop()
    serverAddress: string;                       // the host:port that this openhab is connected to
    @prop({ default: Date.now() })
    createdAt?: Date;
    @prop({ default: Date.now() })
    updatedAt?: Date;
    id?: string;

    static get model(): ModelType<Openhab> {
        return new Openhab().getModelForClass(Openhab, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    static createModel(): InstanceType<Openhab> {
        return new this.model();
    }
}

export const OpenhabModel = new Openhab().getModelForClass(Openhab, { schemaOptions });
