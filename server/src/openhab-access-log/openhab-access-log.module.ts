import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenhabAccessLog } from './models/openhab-access-log';
import { OpenhabAccessLogController } from './openhab-access-log.controller';
import { OpenhabAccessLogService } from './openhab-access-log.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: OpenhabAccessLog.modelName, schema: OpenhabAccessLog.model.schema }])],
    controllers: [OpenhabAccessLogController],
    providers: [OpenhabAccessLogService],
})
export class OpenhabAccessLogModule {
}
