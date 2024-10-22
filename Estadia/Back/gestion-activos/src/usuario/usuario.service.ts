import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUsuarioDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginUsuarioDto): Promise<Usuario> {
    const { email, password } = loginDto;
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (!usuario || usuario.password !== password) {
      throw new BadRequestException('Credenciales incorrectas');
    }

    return usuario;
  }

  async login(loginDto: LoginUsuarioDto): Promise<LoginResponseDto> {
    const usuario = await this.validateUser(loginDto);
    const payload = {
      email: usuario.email,
      sub: usuario.idUsuario,
      roles: usuario.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario,
    };
  }

  /*async login(loginDto: LoginUsuarioDto): Promise<Usuario> {
    const { email, password } = loginDto;

    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (!usuario || usuario.password !== password) {
      throw new BadRequestException('Credenciales incorrectas');
    }

    return usuario;
  }*/

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    return this.usuarioRepository.save(usuario);
  }

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: id },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con el id ${id} no encontrado`);
    }
    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.preload({
      idUsuario: id,
      ...updateUsuarioDto,
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }

  async findByNameEmailOrRole(searchTerm: string): Promise<Usuario[]> {
    const usuarios = await this.usuarioRepository.find({
      where: [
        { name: ILike(`%${searchTerm}%`) },
        { email: ILike(`%${searchTerm}%`) },
        { numberColaborador: ILike(`%${searchTerm}%`) },
      ],
    });

    if (!usuarios.length) {
      throw new NotFoundException(
        `No se encontraron usuarios con el criterio ${searchTerm}`,
      );
    }

    return usuarios;
  }
}
