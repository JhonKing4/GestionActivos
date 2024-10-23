import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MantenimientoService } from './mantenimiento.service';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Mantenimiento } from './entities/mantenimiento.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { RequireRoles } from 'src/decorators/roles.decorator';
import { Roles } from 'src/usuario/enums/roles.enum';

@ApiTags('Mantenimientos')
@Controller('mantenimiento')
export class MantenimientoController {
  constructor(private readonly mantenimientoService: MantenimientoService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN)
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

  @Get('search/:searchTerm')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
  @ApiOperation({
    summary: 'Buscar Mantenimiento por descripcion, fecha o tipo',
  })
  @ApiResponse({
    status: 200,
    description: 'Mantenimientos encontrados con éxito',
    type: [Mantenimiento],
  })
  @ApiResponse({ status: 404, description: 'Mantenimientos no encontrados' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async findByNameEmailOrRole(
    @Param('searchTerm') searchTerm: string,
  ): Promise<Mantenimiento[]> {
    return await this.mantenimientoService.findByNameDescription(searchTerm);
  }
}
