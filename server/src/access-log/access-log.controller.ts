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
import { AccessLog } from './models/access-log';
import { AccessLogVm } from './models/view-models/access-log-vm.model';
import { AccessLogService } from './access-log.service';
import { AccessLogParams } from './models/view-models/access-log-params.model';

@Controller('accesslogs')
@ApiUseTags(AccessLog.modelName)
@ApiBearerAuth()
export class AccessLogController {
    constructor(private readonly _accessLogService: AccessLogService) { }

    @Post()
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({ type: AccessLogVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(AccessLog.modelName, 'Create'))
    async create(@Body() params: AccessLogParams): Promise<AccessLogVm> {
        try {
            const newAccessLog = await this._accessLogService.createAccessLog(params);
            return this._accessLogService.map<AccessLogVm>(newAccessLog);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: AccessLogVm, isArray: true })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(AccessLog.modelName, 'GetAll'))
    async get() {
        return;
    }

    @Put()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: AccessLogVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(AccessLog.modelName, 'Update'))
    async update(@Body() vm: AccessLogVm): Promise<AccessLogVm> {
        const { id } = vm;

        if (!vm || !id) {
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        const exist = await this._accessLogService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }

        if (exist.whenFinished) {
            throw new HttpException('Already completed', HttpStatus.BAD_REQUEST);
        }

        try {
            const updated = await this._accessLogService.update(id, exist);
            return this._accessLogService.map<AccessLogVm>(updated.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: AccessLogVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(AccessLog.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<AccessLogVm> {
        try {
            const deleted = await this._accessLogService.delete(id);
            return this._accessLogService.map<AccessLogVm>(deleted.toJSON());
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
