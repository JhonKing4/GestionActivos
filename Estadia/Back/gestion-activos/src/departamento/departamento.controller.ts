import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Departamento } from './entities/departamento.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { RequireRoles } from 'src/decorators/roles.decorator';
import { Roles } from 'src/usuario/enums/roles.enum';

@ApiTags('Departamentos')
@Controller('departamentos')
export class DepartamentoController {
  constructor(private readonly departamentoService: DepartamentoService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({
    status: 201,
    description: 'Departamento o área creado con éxito',
    type: Departamento,
  })
  @ApiResponse({
    status: 400,
    description: 'Mala petición. Revise e intente de nuevo',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el servidor',
  })
  async create(
    @Body() CreateDepartamentoDto: CreateDepartamentoDto,
  ): Promise<Departamento> {
    return await this.departamentoService.create(CreateDepartamentoDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los Departamentos o áreas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de Departamentos o áreas obtenida con éxito',
    type: [Departamento],
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  findAll(): Promise<Departamento[]> {
    return this.departamentoService.finAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
  @ApiOperation({ summary: 'Obtener un departamento por ID' })
  @ApiResponse({
    status: 200,
    description: 'Departamento encontrado con éxito',
    type: Departamento,
  })
  @ApiResponse({ status: 404, description: 'Departamento no encontrado' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  findOne(@Param('id') id: string) {
    return this.departamentoService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
  @ApiOperation({ summary: 'Actualizar un Departamento o área por ID' })
  @ApiResponse({
    status: 200,
    description: 'Departamento o área actualizado con éxito',
    type: Departamento,
  })
  @ApiResponse({
    status: 404,
    description: 'Departemento o área no encontrado',
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async update(
    @Param('id') id: string,
    @Body() updateDepartamentoDto: CreateDepartamentoDto,
  ) {
    return await this.departamentoService.update(id, updateDepartamentoDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN)
  @ApiOperation({ summary: 'Eliminar un Departamento o área por ID' })
  @ApiResponse({
    status: 200,
    description: 'Departamento o área eliminado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Departemento o área no encontrado',
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.departamentoService.remove(id);
  }

  @Get('name/:name')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
  @ApiOperation({ summary: 'Buscar Departamentos por nombre' })
  @ApiResponse({
    status: 200,
    description: 'Departamentos encontrados con éxito',
    type: [Departamento],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron Departamentos con ese nombre',
  })
  findByName(@Param('name') name: string): Promise<Departamento[]> {
    return this.departamentoService.findByName(name);
  }
}
