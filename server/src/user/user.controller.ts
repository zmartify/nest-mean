import { AccountService } from './../account/account.service';
import { Body, Controller, HttpException, HttpStatus, Post, Get, UseGuards, Param, Logger } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiUseTags, ApiOkResponse } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id.helper';
import { User } from './models/user.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';
import { RegisterVm } from './models/view-models/register-vm.model';
import { UserVm } from './models/view-models/user-vm.model';
import { UserService } from './user.service';
import { map } from 'lodash';
import { Roles } from 'shared/decorators/roles.decorator';
import { UserRole } from './models/user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'shared/guards/roles.guard';
import { AccountVm } from 'account/models/view-models/account-vm.model';

const logger = Logger;

@Controller('users')
@ApiUseTags(User.modelName)
export class UserController {
    constructor(private readonly _userService: UserService,
                private readonly _accountService: AccountService) {}

    @Post('register')
    @ApiCreatedResponse({ type: UserVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'Register'))
    async register(@Body() vm: RegisterVm): Promise<UserVm> {
        const { username, password } = vm;

        if (!username) {
            throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
        }

        if (!password) {
            throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
        }

        let exist;
        try {
            exist = await this._userService.findOne({ username });
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (exist) {
            throw new HttpException(`${username} exists`, HttpStatus.BAD_REQUEST);
        }

        const newUser = await this._userService.register(vm);
        return this._userService.map<UserVm>(newUser);
    }

    @Post('login')
    @ApiCreatedResponse({ type: LoginResponseVm })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'Login'))
    async login(@Body() vm: LoginVm): Promise<LoginResponseVm> {
        const fields = Object.keys(vm);
        fields.forEach(field => {
            if (!vm[field]) {
                throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
            }
        });

        return this._userService.login(vm);
    }

    @Get()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: UserVm, isArray: true })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'GetAll'))
    async get(
    ): Promise<UserVm[]> {
        const filter = {};

        try {
            const users = await this._userService.findAll(filter);
            return this._userService.map<UserVm[]>(map(users, user => user.toJSON()));
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id/accounts')
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: UserVm, isArray: true })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'GetAccounts'))
    async getAccounts(@Param('id') id: string): Promise<AccountVm[]> {

        try {
            // const user = await this._userService.findById(id);
            const filter = { users: [id] };
            const accounts = await this._accountService.findAll(filter);
            return this._accountService.map<AccountVm[]>(map(accounts, account => account.toJSON()));
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id/openhabs')
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: UserVm, isArray: true })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'GetOpenhabs'))
    async getOpenhabs(@Param('id') id: string): Promise<UserVm[]> {
        logger.log('Here we are ' + id);
        try {
            const user = await this._userService.findById(id);
            const filter = { users: [id] };
            const accounts = await this._accountService.findAll(filter);
            logger.log(JSON.stringify(accounts, null, 2));
            return this._accountService.map<UserVm[]>(map(accounts, account => account.toJSON()));
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
