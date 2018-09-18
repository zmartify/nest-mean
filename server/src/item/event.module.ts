import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event } from './models/item';
import { EventController } from './item.controller';
import { EventService } from './item.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Event.modelName, schema: Event.model.schema }])],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
})
export class EventModule {
}
