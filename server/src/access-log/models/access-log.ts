import { Openhab } from 'openhab/models/openhab.model';
import { InstanceType, ModelType, pre, prop, Typegoose, arrayProp, Ref } from 'typegoose';
import { schemaOptions } from 'shared/base.model';
import { User } from 'user/models/user.model';

@pre<AccessLog>('findOneAndUpdate', function(next) {
    this._update.updatedAt = new Date(Date.now());
    next();
})
export class AccessLog extends Typegoose {
    @prop({ ref: Openhab, required: true })
    openhab: Ref<Openhab>;
    @prop({ ref: User, required: true})
    user: Ref<User>;
    @prop()
    path: string;
    @prop()
    method: string;
    @prop()
    remoteHost: string;
    @prop({ default: Date.now() })
    whenStarted?: Date;
    @prop()
    whenFinished?: Date;

    static get model(): ModelType<AccessLog> {
        return new AccessLog().getModelForClass(AccessLog, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    static createModel(): InstanceType<AccessLog> {
        return new this.model();
    }
}

export const AccessLogModel = new AccessLog().getModelForClass(AccessLog, { schemaOptions });
