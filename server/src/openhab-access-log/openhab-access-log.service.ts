import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { BaseService } from 'shared/base.service';
import { MapperService } from 'shared/mapper/mapper.service';
import { OpenhabAccessLog, OpenhabAccessLogModel } from './models/openhab-access-log';
import { OpenhabAccessLogParams } from './models/view-models/openhab-access-log-params.model';

@Injectable()
export class OpenhabAccessLogService extends BaseService<OpenhabAccessLog> {
    constructor(
        @InjectModel(OpenhabAccessLog.modelName) private readonly _openhabAccessLogModel: ModelType<OpenhabAccessLog>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this._model = _openhabAccessLogModel;
        this._mapper = _mapperService.mapper;
    }

    async createOpenhabAccessLog(params: OpenhabAccessLogParams): Promise<OpenhabAccessLog> {
        const { openhab, remoteHost, remoteVersion, remoteClientVersion } = params;

        const newOpenhabAccessLog = new OpenhabAccessLogModel();

        newOpenhabAccessLog.openhab = openhab;
        newOpenhabAccessLog.remoteHost = remoteHost;
        newOpenhabAccessLog.remoteVersion = remoteVersion;
        newOpenhabAccessLog.remoteClientVersion = remoteClientVersion;

        try {
            const result = await this.create(newOpenhabAccessLog);
            return result.toJSON() as OpenhabAccessLog;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
