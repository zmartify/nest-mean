import { RequestTracker } from './request-tracker.service';
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
    All,
    Req,
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
import { ApiException } from '../../shared/api-exception.model';

@Controller()
export class ProxyOpenhabController {
    constructor(private requestTracker: RequestTracker) { }

    @All('rest*')
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({ type: String })
    @ApiBadRequestResponse({ type: ApiException })
    async allRest(@Req() req, @Body() params: any): Promise<any> {
        const requestId = this.requestTracker.acquireRequestId();
        // make a local copy of request headers to modify
        const requestHeaders = req.headers;
        // We need to remove and modify some headers here
        delete requestHeaders['cookie'];
        delete requestHeaders['cookie2'];
        delete requestHeaders['authorization'];
        delete requestHeaders['x-real-ip'];
        delete requestHeaders['x-forwarded-for'];
        delete requestHeaders['x-forwarded-proto'];
        delete requestHeaders['connection'];
        requestHeaders['host'] = req.headers.host || this.getHost() + ':' + this.getPort();
        requestHeaders['user-agent'] = 'openhab-cloud/0.0.1';
        // Strip off path prefix for remote vhosts hack
        let requestPath = req.path;
        if (requestPath.indexOf('/remote/') === 0) {
            requestPath = requestPath.replace('/remote', '');
            // TODO: this is too dirty :-(
            delete requestHeaders['host'];
            requestHeaders['host'] = 'home.' + this.getHost() + ':' + this.getPort();
        }
        delete requestHeaders['cookie'];

        return  JSON.stringify(requestHeaders, null, 2);
    }

    getHost() {
        return 'stangsdalpi';
    }

    getPort() {
        return '8080';
    }
}
