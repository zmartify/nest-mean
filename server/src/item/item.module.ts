import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Item } from './models/item';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Item.modelName, schema: Item.model.schema }])],
    controllers: [ItemController],
    providers: [ItemService],
    exports: [ItemService],
})
export class ItemModule {
}
