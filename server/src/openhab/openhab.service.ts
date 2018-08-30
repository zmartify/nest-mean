import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { BaseService } from 'shared/base.service';
import { MapperService } from 'shared/mapper/mapper.service';
import { Openhab, OpenhabModel } from './models/openhab.model';
import { OpenhabParams } from './models/view-models/openhab-params.model';

@Injectable()
export class OpenhabService extends BaseService<Openhab> {
    constructor(
        @InjectModel(Openhab.modelName) private readonly _openhabModel: ModelType<Openhab>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this._model = _openhabModel;
        this._mapper = _mapperService.mapper;
    }

    async createOpenhab(params: OpenhabParams): Promise<Openhab> {
        const { content, level } = params;

        const newOpenhab = new OpenhabModel();

        newOpenhab.name = name;

        try {
            const result = await this.create(newOpenhab);
            return result.toJSON() as Openhab;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
