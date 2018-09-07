import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { BaseService } from 'shared/base.service';
import { MapperService } from 'shared/mapper/mapper.service';
import { AccessLog, AccessLogModel } from './models/access-log';
import { AccessLogParams } from './models/view-models/access-log-params.model';

@Injectable()
export class AccessLogService extends BaseService<AccessLog> {
    constructor(
        @InjectModel(AccessLog.modelName) private readonly _accessLogModel: ModelType<AccessLog>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this._model = _accessLogModel;
        this._mapper = _mapperService.mapper;
    }

    async createAccessLog(params: AccessLogParams): Promise<AccessLog> {
        const { openhab, user, path, method, remoteHost } = params;

        const newAccessLog = new AccessLogModel();

        newAccessLog.openhab = openhab;
        newAccessLog.user = user;
        newAccessLog.path = path;
        newAccessLog.method = method;
        newAccessLog.remoteHost = remoteHost;

        try {
            const result = await this.create(newAccessLog);
            return result.toJSON() as AccessLog;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
