import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AsignacionService } from './asignacion.service';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Asignacion } from './entities/asignacion.entity';

@ApiTags('Asignaciones')
@Controller('asignacion')
export class AsignacionController {
  constructor(private readonly asignacionService: AsignacionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva asignación' })
  @ApiResponse({
    status: 201,
    description: 'Asignación creada con éxito',
    type: Asignacion,
  })
  @ApiResponse({ status: 400, description: 'Mala petición' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async create(@Body() createAsignacionDto: CreateAsignacionDto) {
    return await this.asignacionService.create(createAsignacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las asignaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de asignaciones obtenida con éxito',
    type: [Asignacion],
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async findAll() {
    return await this.asignacionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una asignación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Asignación encontrada con éxito',
    type: Asignacion,
  })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async findOne(@Param('id') id: string) {
    return await this.asignacionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una asignación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Asignación actualizada con éxito',
    type: Asignacion,
  })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async update(
    @Param('id') id: string,
    @Body() updateAsignacionDto: UpdateAsignacionDto,
  ) {
    return await this.asignacionService.update(id, updateAsignacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una asignación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Asignación eliminada con éxito',
  })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async remove(@Param('id') id: string) {
    return await this.asignacionService.remove(id);
  }
}
