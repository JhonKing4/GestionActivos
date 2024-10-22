import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Material } from './entities/material.entity';

@ApiTags('Materiales')
@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo Material' })
  @ApiResponse({
    status: 201,
    description: 'Material creado con éxito',
    type: Material,
  })
  @ApiResponse({
    status: 400,
    description: 'Mala petición',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el servidor',
  })
  async create(
    @Body() createMaterialDto: CreateMaterialDto,
  ): Promise<Material> {
    return await this.materialService.create(createMaterialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los Materiales' })
  @ApiResponse({
    status: 200,
    description: 'Lista de materiales obtenida con éxito',
    type: [Material],
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el servidor',
  })
  async findAll(): Promise<Material[]> {
    return await this.materialService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un Material por ID' })
  @ApiResponse({
    status: 200,
    description: 'Material obtenido con éxito',
    type: Material,
  })
  @ApiResponse({
    status: 404,
    description: 'Material no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<Material> {
    return await this.materialService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un Material por ID' })
  @ApiResponse({
    status: 200,
    description: 'Material actualizado con éxito',
    type: Material,
  })
  @ApiResponse({
    status: 404,
    description: 'Material no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para la actualización',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    return await this.materialService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un Material por ID' })
  @ApiResponse({
    status: 204,
    description: 'Material eliminado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Material no encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.materialService.remove(id);
  }

  @Get('search/:searchTerm')
  @ApiOperation({ summary: 'Buscar Materiales' })
  @ApiResponse({
    status: 200,
    description: 'Materiales encontrados con éxito',
    type: [Material],
  })
  @ApiResponse({ status: 404, description: 'Materiales no encontrados' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async findByNameEmailOrRole(
    @Param('searchTerm') searchTerm: string,
  ): Promise<Material[]> {
    return await this.materialService.findByMaterialSearchTerm(searchTerm);
  }
}
