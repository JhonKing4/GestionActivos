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
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Usuario } from './entities/usuario.entity';
import { LoginUsuarioDto } from './dto/login.dto';
import { RequireRoles } from '../decorators/roles.decorator';
import { Roles } from './enums/roles.enum';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('Usuarios')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
  @ApiOperation({ summary: 'Crear un nuevo Usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado con éxito',
    type: Usuario,
  })
  @ApiResponse({
    status: 400,
    description: 'Mala petición. Ya existe un proveedor con este email.',
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return await this.usuarioService.create(createUsuarioDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con credenciales' })
  async login(@Body() loginDto: LoginUsuarioDto): Promise<LoginResponseDto> {
    return await this.usuarioService.login(loginDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenidas con éxito',
    type: [Usuario],
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado con éxito',
    type: Usuario,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  findOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado con éxito',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    return await this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN)
  @ApiOperation({ summary: 'Eliminar un Usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usuarioService.remove(id);
  }

  @Get('search/:searchTerm')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.USUARIO)
  @ApiOperation({ summary: 'Buscar usuarios por nombre, email o rol' })
  @ApiResponse({
    status: 200,
    description: 'Usuarios encontrados con éxito',
    type: [Usuario],
  })
  @ApiResponse({ status: 404, description: 'Usuarios no encontrados' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async findByNameEmailOrRole(
    @Param('searchTerm') searchTerm: string,
  ): Promise<Usuario[]> {
    return await this.usuarioService.findByNameEmailOrRole(searchTerm);
  }
}
