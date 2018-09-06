import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { BaseService } from 'shared/base.service';
import { MapperService } from 'shared/mapper/mapper.service';
import { RequestLog, RequestLogModel } from './models/request-log';
import { RequestLogParams } from './models/view-models/request-log-params.model';

@Injectable()
export class RequestLogService extends BaseService<RequestLog> {
    constructor(
        @InjectModel(RequestLog.modelName) private readonly _requestLogModel: ModelType<RequestLog>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this._model = _requestLogModel;
        this._mapper = _mapperService.mapper;
    }

    async createRequestLog(params: RequestLogParams): Promise<RequestLog> {
        const { openhab, remoteHost, remoteVersion, remoteClientVersion } = params;

        const newRequestLog = new RequestLogModel();

        newRequestLog.openhab = openhab;
        newRequestLog.remoteHost = remoteHost;
        newRequestLog.remoteVersion = remoteVersion;
        newRequestLog.remoteClientVersion = remoteClientVersion;

        try {
            const result = await this.create(newRequestLog);
            return result.toJSON() as RequestLog;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
