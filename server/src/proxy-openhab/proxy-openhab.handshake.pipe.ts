import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ProxyOpenhabHandshakePipe implements PipeTransform {
  transform(socket: any, metadata: ArgumentMetadata) {
    console.log(JSON.stringify(socket, null, 2));
    return socket;
  }
}