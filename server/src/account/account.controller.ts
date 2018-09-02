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
import { AccountLevel } from './models/account-level.enum';
import { Account } from './models/account';
import { AccountParams } from './models/view-models/account-params.model';
import { AccountVm } from './models/view-models/account-vm.model';
import { AccountService } from './account.service';

@Controller('accounts')
@ApiUseTags(Account.modelName)
@ApiBearerAuth()
export class AccountController {
    constructor(private readonly _todoService: AccountService) {}

    @Post()
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({ type: AccountVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Account.modelName, 'Create'))
    async create(@Body() params: AccountParams): Promise<AccountVm> {
        try {
            const newAccount = await this._todoService.createAccount(params);
            return this._todoService.map<AccountVm>(newAccount);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: AccountVm, isArray: true })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Account.modelName, 'GetAll'))
    @ApiImplicitQuery({ name: 'level', enum: EnumToArray(AccountLevel), required: false, isArray: true })
    @ApiImplicitQuery({ name: 'isCompleted', required: false })
    async get(
        @Query('level') level?: AccountLevel,
        @Query('isCompleted', new ToBooleanPipe())
            isCompleted?: boolean,
    ): Promise<AccountVm[]> {
        let filter = {};

        if (level) {
            filter['level'] = { $in: isArray(level) ? [...level] : [level] };
        }

        if (isCompleted !== null) {
            if (filter['level']) {
                filter = { $and: [{ level: filter['level'] }, { isCompleted }] };
            } else {
                filter['isCompleted'] = isCompleted;
            }
        }

        try {
            const todos = await this._todoService.findAll(filter);
            return this._todoService.map<AccountVm[]>(map(todos, todo => todo.toJSON()));
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: AccountVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Account.modelName, 'Update'))
    async update(@Body() vm: AccountVm): Promise<AccountVm> {
        const { id, content, level, isCompleted } = vm;

        if (!vm || !id) {
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        const exist = await this._todoService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }

        if (exist.isCompleted) {
            throw new HttpException('Already completed', HttpStatus.BAD_REQUEST);
        }

        exist.content = content;
        exist.isCompleted = isCompleted;
        exist.level = level;

        try {
            const updated = await this._todoService.update(id, exist);
            return this._todoService.map<AccountVm>(updated.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: AccountVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(Account.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<AccountVm> {
        try {
            const deleted = await this._todoService.delete(id);
            return this._todoService.map<AccountVm>(deleted.toJSON());
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
