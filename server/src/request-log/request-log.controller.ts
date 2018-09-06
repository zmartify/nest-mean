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
import { RequestLog } from './models/request-log';
import { RequestLogVm } from './models/view-models/request-log-vm.model';
import { RequestLogService } from './request-log.service';
import { RequestLogParams } from './models/view-models/request-log-params.model';

@Controller('RequestLogs')
@ApiUseTags(RequestLog.modelName)
@ApiBearerAuth()
export class RequestLogController {
    constructor(private readonly _requestLogService: RequestLogService) { }

    @Post()
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({ type: RequestLogVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(RequestLog.modelName, 'Create'))
    async create(@Body() params: RequestLogParams): Promise<RequestLogVm> {
        try {
            const newRequestLog = await this._requestLogService.createRequestLog(params);
            return this._requestLogService.map<RequestLogVm>(newRequestLog);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: RequestLogVm, isArray: true })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(RequestLog.modelName, 'GetAll'))
    async get() {
        return;
    }

    @Put()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: RequestLogVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(RequestLog.modelName, 'Update'))
    async update(@Body() vm: RequestLogVm): Promise<RequestLogVm> {
        const { id } = vm;

        if (!vm || !id) {
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        const exist = await this._requestLogService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }

        if (exist.whenFinished) {
            throw new HttpException('Already completed', HttpStatus.BAD_REQUEST);
        }

        try {
            const updated = await this._requestLogService.update(id, exist);
            return this._requestLogService.map<RequestLogVm>(updated.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: RequestLogVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(RequestLog.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<RequestLogVm> {
        try {
            const deleted = await this._requestLogService.delete(id);
            return this._requestLogService.map<RequestLogVm>(deleted.toJSON());
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
