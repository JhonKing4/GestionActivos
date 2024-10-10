import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asignacion } from './entities/asignacion.entity';
import { Material } from 'src/material/entities/material.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';

@Injectable()
export class AsignacionService {
  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  async create(createAsignacionDto: CreateAsignacionDto): Promise<Asignacion> {
    const { materialId, usuarioId, departamentoId, hotelId, ...restoDatos } =
      createAsignacionDto;

    const materiales = await this.materialRepository.findByIds(materialId);
    if (materiales.length === 0) {
      throw new NotFoundException('No se encontraron materiales válidos.');
    }

    const usuario = await this.usuarioRepository.findOneBy({
      idUsuario: usuarioId,
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const departamento = await this.departamentoRepository.findOneBy({
      idDepartamento: departamentoId,
    });
    if (!departamento) {
      throw new NotFoundException(
        `Departamento con ID ${departamentoId} no encontrado`,
      );
    }

    const hotel = await this.hotelRepository.findOneBy({ idHotel: hotelId });
    if (!hotel) {
      throw new NotFoundException(`Hotel con ID ${hotelId} no encontrado`);
    }

    const materialIds = materiales.map((material) => material.idMaterial);

    const asignacionesExistentes = await this.asignacionRepository
      .createQueryBuilder('asignacion')
      .leftJoinAndSelect('asignacion.material', 'material')
      .where('material.idMaterial IN (:...materialIds)', { materialIds })
      .getMany();

    if (asignacionesExistentes.length > 0) {
      const materialesYaAsignados = asignacionesExistentes
        .map((asignacion) => asignacion.material.map((m) => m.idMaterial))
        .flat();

      throw new ConflictException(
        `El material con ID ${materialesYaAsignados.join(', ')} ya está asignado. No se puede volver a asignar.`,
      );
    }

    const nuevaAsignacion = this.asignacionRepository.create({
      ...restoDatos,
      usuario,
      departamento,
      hotel,
      material: materiales,
    });

    return await this.asignacionRepository.save(nuevaAsignacion);
  }

  async findAll(): Promise<Asignacion[]> {
    return await this.asignacionRepository.find({
      relations: ['material', 'usuario', 'departamento', 'hotel'],
    });
  }

  async findOne(id: string): Promise<Asignacion> {
    const asignacion = await this.asignacionRepository.findOne({
      where: { idAsignacion: id },
      relations: ['material', 'usuario', 'departamento', 'hotel'],
    });
    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }
    return asignacion;
  }

  async update(
    id: string,
    updateAsignacionDto: UpdateAsignacionDto,
  ): Promise<Asignacion> {
    const asignacion = await this.asignacionRepository.findOne({
      where: { idAsignacion: id },
      relations: ['material', 'usuario', 'departamento', 'hotel'],
    });

    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }

    if (updateAsignacionDto.materialId) {
      const materiales = await this.materialRepository.findByIds(
        updateAsignacionDto.materialId,
      );
      if (materiales.length === 0) {
        throw new NotFoundException('No se encontraron materiales válidos.');
      }
      asignacion.material = materiales;
    }

    if (updateAsignacionDto.usuarioId) {
      const usuario = await this.usuarioRepository.findOneBy({
        idUsuario: updateAsignacionDto.usuarioId,
      });
      if (!usuario) {
        throw new NotFoundException(
          `Usuario con ID ${updateAsignacionDto.usuarioId} no encontrado`,
        );
      }
      asignacion.usuario = usuario;
    }

    if (updateAsignacionDto.departamentoId) {
      const departamento = await this.departamentoRepository.findOneBy({
        idDepartamento: updateAsignacionDto.departamentoId,
      });
      if (!departamento) {
        throw new NotFoundException(
          `Departamento con ID ${updateAsignacionDto.departamentoId} no encontrado`,
        );
      }
      asignacion.departamento = departamento;
    }

    if (updateAsignacionDto.hotelId) {
      const hotel = await this.hotelRepository.findOneBy({
        idHotel: updateAsignacionDto.hotelId,
      });
      if (!hotel) {
        throw new NotFoundException(
          `Hotel con ID ${updateAsignacionDto.hotelId} no encontrado`,
        );
      }
      asignacion.hotel = hotel;
    }

    Object.assign(asignacion, updateAsignacionDto);

    return await this.asignacionRepository.save(asignacion);
  }

  async remove(id: string): Promise<void> {
    const asignacion = await this.asignacionRepository.findOne({
      where: { idAsignacion: id },
      relations: ['material'],
    });

    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }

    asignacion.material.forEach(async (material) => {
      material.asignacion = null;
      await this.materialRepository.save(material);
    });

    await this.asignacionRepository.remove(asignacion);
  }
}
