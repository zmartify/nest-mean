import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLog } from './models/request-log';
import { RequestLogController } from './request-log.controller';
import { RequestLogService } from './request-log.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: RequestLog.modelName, schema: RequestLog.model.schema }])],
    controllers: [RequestLogController],
    providers: [RequestLogService],
    exports: [RequestLogService],
})
export class RequestLogModule {
}
