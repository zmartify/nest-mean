import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiImplicitQuery,
    ApiOkResponse,
    ApiOperation,
    ApiUseTags,
} from '@nestjs/swagger';
import { ApiException } from 'shared/api-exception.model';
import { GetOperationId } from 'shared/utilities/get-operation-id.helper';
import { ItemVm } from './models/view-models/item-vm.model';
import { ItemService } from './item.service';
import { Ref } from '@aljazerzen/typegoose';
import { Openhab } from 'openhab/models/openhab.model';
import { ItemParams } from './models/view-models/item-params.model';
import { Item } from './models/item.model';

@Controller('items')
@ApiUseTags(Item.modelName)
@ApiBearerAuth()
export class ItemController {
    constructor(private readonly _itemService: ItemService) { }

    @Post()
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({ type: ItemVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Item.modelName, 'Create'))
    async create(@Body() params: ItemParams): Promise<ItemVm> {
        try {
            const newItem = await this._itemService.createItem(params);
            return this._itemService.map<ItemVm>(newItem);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: ItemVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Item.modelName, 'Update'))
    async update(@Body() vm: ItemVm): Promise<ItemVm> {
        const { id, status } = vm;

        if (!vm || !id) {
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        const exist = await this._itemService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }

        try {
            const updated = await this._itemService.update(id, exist);
            return this._itemService.map<ItemVm>(updated.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: ItemVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Item.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<ItemVm> {
        try {
            const deleted = await this._itemService.delete(id);
            return this._itemService.map<ItemVm>(deleted.toJSON());
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
