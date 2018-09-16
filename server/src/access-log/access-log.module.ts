import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessLog } from './models/access-log';
import { AccessLogController } from './access-log.controller';
import { AccessLogService } from './access-log.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: AccessLog.modelName, schema: AccessLog.model.schema }])],
    controllers: [AccessLogController],
    providers: [AccessLogService],
    exports: [AccessLogService],
})
export class AccessLogModule {
}
