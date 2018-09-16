import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event } from './models/event';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Event.modelName, schema: Event.model.schema }])],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
})
export class EventModule {
}
