import { Openhab } from 'openhab/models/openhab.model';
import { InstanceType, ModelType, pre, prop, Typegoose, arrayProp, Ref, index } from '@aljazerzen/typegoose';
import { schemaOptions } from 'shared/base.model';
import { AccountLevel } from './account-level.enum';
import { User } from 'user/models/user.model';

@pre<Account>('findOneAndUpdate', function(next) {
    this._update.updatedAt = new Date(Date.now());
    next();
})
@index({ name: 1, users: 2 })
@index({ level: 1, name: 2 })
@index({ openhabs: 1 })
@index({ users: 1 })
export class Account extends Typegoose {
    @prop({ required: [true, 'Name is required'] })
    name: string;
    @prop({ enum: AccountLevel, default: AccountLevel.Free })
    level: AccountLevel;
    @arrayProp({ itemsRef: Openhab })
    openhabs: Ref<Openhab>[];
    @arrayProp({ itemsRef: User })
    users: Ref<User>[];
    @prop({ default: false })
    isActive: boolean;
    @prop({ default: Date.now() })
    createdAt?: Date;
    @prop({ default: Date.now() })
    updatedAt?: Date;
    id?: string;

    static get model(): ModelType<Account> {
        return new Account().getModelForClass(Account, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    static createModel(): InstanceType<Account> {
        return new this.model();
    }
}

export const AccountModel = new Account().getModelForClass(Account, { schemaOptions });
