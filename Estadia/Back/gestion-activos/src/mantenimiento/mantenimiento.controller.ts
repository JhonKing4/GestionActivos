import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { MantenimientoService } from './mantenimiento.service';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Mantenimiento } from './entities/mantenimiento.entity';

@ApiTags('Mantenimientos')
@Controller('mantenimiento')
export class MantenimientoController {
  constructor(private readonly mantenimientoService: MantenimientoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo mantenimiento' })
  @ApiResponse({
    status: 201,
    description: 'Mantenimiento creado con éxito',
    type: Mantenimiento,
  })
  @ApiResponse({ status: 400, description: 'Mala petición' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async create(@Body() createMantenimientoDto: CreateMantenimientoDto) {
    return await this.mantenimientoService.create(createMantenimientoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los mantenimientos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de mantenimientos obtenida con éxito',
    type: [Mantenimiento],
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async findAll(): Promise<Mantenimiento[]> {
    return await this.mantenimientoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un mantenimiento por ID' })
  @ApiResponse({
    status: 200,
    description: 'Mantenimiento encontrado con éxito',
    type: Mantenimiento,
  })
  @ApiResponse({ status: 404, description: 'Mantenimiento no encontrado' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async findOne(@Param('id') id: string) {
    return await this.mantenimientoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un mantenimiento por ID' })
  @ApiResponse({
    status: 200,
    description: 'Mantenimiento actualizado con éxito',
    type: Mantenimiento,
  })
  @ApiResponse({ status: 404, description: 'Mantenimiento no encontrado' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async update(
    @Param('id') id: string,
    @Body() updateMantenimientoDto: UpdateMantenimientoDto,
  ) {
    return await this.mantenimientoService.update(id, updateMantenimientoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un mantenimiento por ID' })
  @ApiResponse({
    status: 200,
    description: 'Mantenimiento eliminado con éxito',
  })
  @ApiResponse({ status: 404, description: 'Mantenimiento no encontrado' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async remove(@Param('id') id: string) {
    return await this.mantenimientoService.remove(id);
  }
}