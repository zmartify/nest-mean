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
import { OpenhabAccessLog } from './models/openhab-access-log';
import { OpenhabAccessLogVm } from './models/view-models/openhab-access-log-vm.model';
import { OpenhabAccessLogService } from './openhab-access-log.service';
import { OpenhabAccessLogParams } from './models/view-models/openhab-access-log-params.model';

@Controller('OpenhabAccessLogs')
@ApiUseTags(OpenhabAccessLog.modelName)
@ApiBearerAuth()
export class OpenhabAccessLogController {
    constructor(private readonly _openhabAccessLogService: OpenhabAccessLogService) { }

    @Post()
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({ type: OpenhabAccessLogVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(OpenhabAccessLog.modelName, 'Create'))
    async create(@Body() params: OpenhabAccessLogParams): Promise<OpenhabAccessLogVm> {
        try {
            const newOpenhabAccessLog = await this._openhabAccessLogService.createOpenhabAccessLog(params);
            return this._openhabAccessLogService.map<OpenhabAccessLogVm>(newOpenhabAccessLog);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: OpenhabAccessLogVm, isArray: true })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(OpenhabAccessLog.modelName, 'GetAll'))
    async get() {
        return;
    }

    @Put()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: OpenhabAccessLogVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(OpenhabAccessLog.modelName, 'Update'))
    async update(@Body() vm: OpenhabAccessLogVm): Promise<OpenhabAccessLogVm> {
        const { id } = vm;

        if (!vm || !id) {
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        const exist = await this._openhabAccessLogService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }

        if (exist.whenFinished) {
            throw new HttpException('Already completed', HttpStatus.BAD_REQUEST);
        }

        try {
            const updated = await this._openhabAccessLogService.update(id, exist);
            return this._openhabAccessLogService.map<OpenhabAccessLogVm>(updated.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: OpenhabAccessLogVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(OpenhabAccessLog.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<OpenhabAccessLogVm> {
        try {
            const deleted = await this._openhabAccessLogService.delete(id);
            return this._openhabAccessLogService.map<OpenhabAccessLogVm>(deleted.toJSON());
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
