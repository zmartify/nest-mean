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
    Res,
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
import { ProxyOpenhabGateway } from './proxy-openhab.gateway';

@Controller()
export class ProxyOpenhabController {
    constructor(private requestTracker: RequestTracker,
                private gateway: ProxyOpenhabGateway) { }

    @All('rest*')
    // @Roles(UserRole.Admin)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({ type: String })
    @ApiBadRequestResponse({ type: ApiException })
    async allRest(@Req() req, @Res() res, @Body() params: any): Promise<any> {
        this.emitRequest(res, req);
        return  'hello from rest';
    }

    emitRequest(req, res) {
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

    // Send a message with request to openhab agent module
        this.gateway.emitRequest(req.openhab.uuid, {
        id: requestId,
        method: req.method,
        headers: requestHeaders,
        path: requestPath,
        query: req.query,
        body: req.rawBody,
    });
        res.openhab = req.openhab;
        this.requestTracker.add(res, requestId);

    // we should only have to catch these two callbacks to hear about the response
    // being close/finished, but thats not the case. Sometimes neither gets called
    // and we have to manually clean up.  We have a interval for this above.

    // when a response is closed by the requester
        res.on('close', function() {
        self.io.sockets.in(req.openhab.uuid).emit('cancel', {
            id: requestId,
        });
        this.requestTracker.remove(requestId);
    });

    // when a response is closed by us
        res.on('finish', function() {
        this.requestTracker.remove(requestId);
    });
    }

    getHost() {
        return 'stangsdalpi';
    }

    getPort() {
        return '8080';
    }
}
