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
import { isArray, map } from 'lodash';
import { ApiException } from 'shared/api-exception.model';
import { ToBooleanPipe } from 'shared/pipes/to-boolean.pipe';
import { EnumToArray } from 'shared/utilities/enum-to-array.helper';
import { GetOperationId } from 'shared/utilities/get-operation-id.helper';
import { EventVm } from './models/view-models/event-vm.model';
import { EventService } from './event.service';
import { Ref } from '@aljazerzen/typegoose';
import { Openhab } from 'openhab/models/openhab.model';
import { EventParams } from './models/view-models/event-params.model';
import { Event } from './models/event';

@Controller('events')
@ApiUseTags(Event.modelName)
@ApiBearerAuth()
export class EventController {
    constructor(private readonly _eventService: EventService) { }

    @Post()
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({ type: EventVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Event.modelName, 'Create'))
    async create(@Body() params: EventParams): Promise<EventVm> {
        try {
            const newEvent = await this._eventService.createEvent(params);
            return this._eventService.map<EventVm>(newEvent);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: EventVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Event.modelName, 'Update'))
    async update(@Body() vm: EventVm): Promise<EventVm> {
        const { id, status, numericStatus, color } = vm;

        if (!vm || !id) {
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        const exist = await this._eventService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }

        if (status) {
            exist.oldStatus = exist.status;
            exist.status = status;
        }

        if (numericStatus) {
            exist.oldNumericStatus = exist.numericStatus;
            exist.numericStatus = numericStatus;
        }

        if (color) exist.color = color;

        try {
            const updated = await this._eventService.update(id, exist);
            return this._eventService.map<EventVm>(updated.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: EventVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Event.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<EventVm> {
        try {
            const deleted = await this._eventService.delete(id);
            return this._eventService.map<EventVm>(deleted.toJSON());
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
