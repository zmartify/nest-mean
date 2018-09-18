import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { BaseService } from 'shared/base.service';
import { MapperService } from 'shared/mapper/mapper.service';
import { Item, ItemModel } from './models/item';
import { ItemParams } from './models/view-models/item-params.model';

export const GoodColor = '#e0f0d5';
export const BadColor = '#f1dede';
export const InfoColor = '#daedf8';

@Injectable()
export class ItemService extends BaseService<Item> {
    constructor(
        @InjectModel(Item.modelName) private readonly _eventModel: ModelType<Item>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this._model = _eventModel;
        this._mapper = _mapperService.mapper;
    }

    async createItem(params: ItemParams): Promise<Item> {
        const { openhab, name } = params;

        const newItem = new ItemModel();

        newItem.openhab = openhab;
        newItem.name = name;

        try {
            const result = await this.create(newItem);
            return result.toJSON() as Item;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
