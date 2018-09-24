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
    Logger,
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
import { OpenhabVm } from './models/view-models/openhab-vm.model';
import { OpenhabParams } from './models/view-models/openhab-params.model';
import { Openhab } from './models/openhab.model';
import { OpenhabStatus } from 'shared/enums/openhab-status.enum';
import { OpenhabService } from './openhab.service';

const logger = Logger;

@Controller('openhabs')
@ApiUseTags(Openhab.modelName)
@ApiBearerAuth()
export class OpenhabController {
    constructor(private readonly _openhabService: OpenhabService) {}

    @Post()
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({ type: OpenhabVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Openhab.modelName, 'Create'))
    async create(@Body() params: OpenhabParams): Promise<OpenhabVm> {
        try {
            const newOpenhab = await this._openhabService.createOpenhab(params);
            return this._openhabService.map<OpenhabVm>(newOpenhab);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: OpenhabVm, isArray: true })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Openhab.modelName, 'GetAll'))
    @ApiImplicitQuery({ name: 'level', enum: EnumToArray(OpenhabStatus), required: false, isArray: true })
    @ApiImplicitQuery({ name: 'isCompleted', required: false })
    async get(
        @Query('status') status?: OpenhabStatus,
        @Query('online', new ToBooleanPipe()) online?: boolean,
    ): Promise<OpenhabVm[]> {
        let filter = {};

        if (status) {
            filter['status'] = { $in: isArray(status) ? [...status] : [status] };
        }

        if (online !== null) {
            if (filter['status']) {
                filter = { $and: [{ level: filter['level'] }, { online }] };
            } else {
                filter['online'] = online;
            }
        }

        logger.log('Filter: ' + JSON.stringify(filter, null, 2));

        try {
            const openhabs = await this._openhabService.findAll(filter);
            return this._openhabService.map<OpenhabVm[]>(map(openhabs, openhab => openhab.toJSON()));
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: OpenhabVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Openhab.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<OpenhabVm> {
        try {
            const deleted = await this._openhabService.delete(id);
            return this._openhabService.map<OpenhabVm>(deleted.toJSON());
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
