import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Proveedor } from './entities/proveedor.entity';

@ApiTags('Proveedores')
@Controller('proveedores')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({
    status: 201,
    description: 'Proveedor creado con éxito',
    type: Proveedor,
  })
  @ApiResponse({
    status: 400,
    description:
      'Mala petición. Ya existe un proveedor con este email o teléfono.',
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async create(
    @Body() createProveedorDto: CreateProveedorDto,
  ): Promise<Proveedor> {
    return await this.proveedorService.create(createProveedorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de proveedores obtenida con éxito',
    type: [Proveedor],
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  findAll(): Promise<Proveedor[]> {
    return this.proveedorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proveedor por ID' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor encontrado con éxito',
    type: Proveedor,
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  findOne(@Param('id') id: string): Promise<Proveedor> {
    return this.proveedorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un proveedor por ID' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor actualizado con éxito',
    type: Proveedor,
  })
  @ApiResponse({
    status: 404,
    description: 'Proveedor no encontrado',
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async update(
    @Param('id') id: string,
    @Body() updateProveedorDto: CreateProveedorDto,
  ): Promise<Proveedor> {
    return await this.proveedorService.update(id, updateProveedorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un proveedor por ID' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor eliminado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Proveedor no encontrado',
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.proveedorService.remove(id);
  }

  @Get('search/:searchTerm')
  @ApiOperation({ summary: 'Buscar usuarios por nombre, email o rol' })
  @ApiResponse({
    status: 200,
    description: 'Usuarios encontrados con éxito',
    type: [Proveedor],
  })
  @ApiResponse({ status: 404, description: 'Usuarios no encontrados' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async findByNameEmailOrRole(
    @Param('searchTerm') searchTerm: string,
  ): Promise<Proveedor[]> {
    return await this.proveedorService.findByNameEmailPhone(searchTerm);
  }
}
