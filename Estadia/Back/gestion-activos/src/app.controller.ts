import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Exitoso')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('bienvenida')
  @ApiOperation({
    summary: 'Bienvenida y verificacion si el servidor esta corriendo',
  })
  getBienvenida(): string {
    return this.appService.getBienvenida();
  }
}
