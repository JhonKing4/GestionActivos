import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getBienvenida(): string {
    return 'Hello World!';
  }
}
