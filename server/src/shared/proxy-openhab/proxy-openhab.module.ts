import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

@Module({
    imports: [MongooseModule.forFeature([{ name: ProxyOpenhab.modelName, schema: ProxyOpenhab.model.schema }])],
    controllers: [ProxyOpenhabController],
    providers: [ProxyOpenhabService],
})
export class TodoModule {
}
