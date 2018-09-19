import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from '@aljazerzen/typegoose';
import { BaseService } from 'shared/base.service';
import { MapperService } from 'shared/mapper/mapper.service';
import { Event, EventModel } from './models/event';
import { EventParams } from './models/view-models/event-params.model';

export const GoodColor = '#e0f0d5';
export const BadColor = '#f1dede';
export const InfoColor = '#daedf8';

@Injectable()
export class EventService extends BaseService<Event> {
    constructor(
        @InjectModel(Event.modelName) private readonly _eventModel: ModelType<Event>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this._model = _eventModel;
        this._mapper = _mapperService.mapper;
    }

    async createEvent(params: EventParams): Promise<Event> {
        const { openhab, source, status, numericStatus, color } = params;

        const newEvent = new EventModel();

        newEvent.openhab = openhab;
        newEvent.source = source;

        if (status) {
            newEvent.status = status;
        }

        if (numericStatus) {
            newEvent.numericStatus = numericStatus;
        }

        try {
            const result = await this.create(newEvent);
            return result.toJSON() as Event;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
