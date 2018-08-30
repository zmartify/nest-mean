import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Openhab } from './models/openhab.model';
import { OpenhabController } from './openhab.controller';
import { OpenhabService } from './openhab.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Openhab.modelName, schema: Openhab.model.schema }])],
    controllers: [OpenhabController],
    providers: [OpenhabService],
})
export class OpenhabModule {
}
