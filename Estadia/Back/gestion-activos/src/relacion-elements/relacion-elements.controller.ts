import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { RelacionElementsService } from './relacion-elements.service';
import { CreateRelacionElementDto } from './dto/create-relacion-element.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RelacionElement } from './entities/relacion-element.entity';

@ApiTags('Relacion de Padre-Hijo')
@Controller('relacion-elements')
export class RelacionElementsController {
  constructor(
    private readonly relacionElementsService: RelacionElementsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva relación de elementos' })
  @ApiResponse({
    status: 201,
    description: 'Relación creada con éxito',
    type: RelacionElement,
  })
  @ApiResponse({ status: 400, description: 'Mala petición' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async create(@Body() createRelacionElementosDto: CreateRelacionElementDto) {
    return await this.relacionElementsService.create(
      createRelacionElementosDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las relaciones de elementos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de relaciones obtenida con éxito',
    type: [RelacionElement],
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll() {
    return await this.relacionElementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una relación de elementos por ID' })
  @ApiResponse({
    status: 200,
    description: 'Relación encontrada con éxito',
    type: RelacionElement,
  })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id') id: string) {
    return await this.relacionElementsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una relación por ID ' })
  @ApiResponse({
    status: 200,
    description: 'Relacion de materiales actualizada con éxito',
    type: RelacionElement,
  })
  @ApiResponse({
    status: 404,
    description: 'Relacion de materiales no encontrada',
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async update(
    @Param('id') id: string,
    @Body() updateAsignacionDto: CreateRelacionElementDto,
  ) {
    return await this.relacionElementsService.update(id, updateAsignacionDto);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una relación de elementos por ID' })
  @ApiResponse({
    status: 200,
    description: 'Relación eliminada con éxito',
  })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async remove(@Param('id') id: string) {
    return await this.relacionElementsService.remove(id);
  }
}
