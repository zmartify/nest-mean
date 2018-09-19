import { Openhab } from 'openhab/models/openhab.model';
import { InstanceType, ModelType, pre, prop, Typegoose, arrayProp, Ref } from '@aljazerzen/typegoose';
import { schemaOptions } from 'shared/base.model';

@pre<OpenhabAccessLog>('findOneAndUpdate', function(next) {
    this._update.updatedAt = new Date(Date.now());
    next();
})
export class OpenhabAccessLog extends Typegoose {
    @prop({ ref: Openhab, required: true })
    openhab: Ref<Openhab>;
    @prop()
    remoteHost: string;
    @prop()
    remoteVersion: string;
    @prop()
    remoteClientVersion: string;
    @prop({ default: Date.now() })
    whenStarted?: Date;
    @prop()
    whenFinished?: Date;

    static get model(): ModelType<OpenhabAccessLog> {
        return new OpenhabAccessLog().getModelForClass(OpenhabAccessLog, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    static createModel(): InstanceType<OpenhabAccessLog> {
        return new this.model();
    }
}

export const OpenhabAccessLogModel = new OpenhabAccessLog().getModelForClass(OpenhabAccessLog, { schemaOptions });
