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
import { AsignacionService } from './asignacion.service';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Asignacion } from './entities/asignacion.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { RequireRoles } from 'src/decorators/roles.decorator';
import { Roles } from 'src/usuario/enums/roles.enum';

@ApiTags('Asignaciones')
@Controller('asignacion')
export class AsignacionController {
  constructor(private readonly asignacionService: AsignacionService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN)
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

  @Get('search/:searchTerm')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
  @ApiOperation({ summary: 'Buscar Asignaciones' })
  @ApiResponse({
    status: 200,
    description: 'Asignaciones encontrados con éxito',
    type: [Asignacion],
  })
  @ApiResponse({ status: 404, description: 'Asignaciones no encontrados' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async findByNameEmailOrRole(
    @Param('searchTerm') searchTerm: string,
  ): Promise<Asignacion[]> {
    return await this.asignacionService.findByAssignmentSearchTerm(searchTerm);
  }
}
