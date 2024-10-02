import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Material } from 'src/material/entities/material.entity';
import { Repository } from 'typeorm';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { Mantenimiento } from './entities/mantenimiento.entity';

@Injectable()
export class MantenimientoService {
  constructor(
    @InjectRepository(Mantenimiento)
    private readonly mantenimientoRepository: Repository<Mantenimiento>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async create(createMantenimientoDto: CreateMantenimientoDto) {
    await validateOrReject(
      plainToClass(CreateMantenimientoDto, createMantenimientoDto),
    );

    try {
      const material = await this.materialRepository.findOne({
        where: { idMaterial: createMantenimientoDto.material },
      });
      if (!material) {
        throw new NotFoundException(`Material no encontrado`);
      }

      const nuevoMantenimiento = this.mantenimientoRepository.create({
        ...createMantenimientoDto,
        material,
      });

      const mantenimientoGuardado =
        await this.mantenimientoRepository.save(nuevoMantenimiento);

      return {
        message: 'Mantenimiento creado con éxito',
        data: mantenimientoGuardado,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el mantenimiento. Detalles: ${error.message}`,
      );
    }
  }
  findAll(): Promise<Mantenimiento[]> {
    return this.mantenimientoRepository.find();
  }
  /*
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const mantenimientos = await this.mantenimientoRepository.find({
        take: limit,
        skip: offset,
      });

      return {
        message: 'Lista de mantenimientos obtenida con éxito',
        data: mantenimientos,
        totalRecords: mantenimientos.length,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener los mantenimientos: ' + error.message,
      );
    }
  }
*/
  async findOne(id: string) {
    try {
      const mantenimiento = await this.mantenimientoRepository.findOne({
        where: { idMantenimiento: id },
      });

      if (!mantenimiento) {
        throw new NotFoundException(
          `No se encontró el mantenimiento con ID: ${id}`,
        );
      }

      return {
        message: 'Mantenimiento encontrado con éxito',
        data: mantenimiento,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener el mantenimiento. Detalles: ${error.message}`,
      );
    }
  }

  async update(id: string, updateMantenimientoDto: UpdateMantenimientoDto) {
    await validateOrReject(
      plainToClass(UpdateMantenimientoDto, updateMantenimientoDto),
    );

    const mantenimiento = await this.mantenimientoRepository.findOne({
      where: { idMantenimiento: id },
    });

    if (!mantenimiento) {
      throw new NotFoundException(`Mantenimiento no encontrado.`);
    }

    try {
      const material = await this.materialRepository.findOne({
        where: { idMaterial: updateMantenimientoDto.material },
      });

      if (!material) {
        throw new NotFoundException(`Material no encontrado.`);
      }

      await this.mantenimientoRepository.save({
        ...mantenimiento,
        ...updateMantenimientoDto,
        material,
      });

      return {
        message: 'Mantenimiento actualizado con éxito',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar el mantenimiento. Detalles: ${error.message}`,
      );
    }
  }

  async remove(id: string) {
    const mantenimiento = await this.mantenimientoRepository.findOne({
      where: { idMantenimiento: id },
    });

    if (!mantenimiento) {
      throw new NotFoundException(
        `No se encontró el mantenimiento con ID: ${id}`,
      );
    }

    try {
      await this.mantenimientoRepository.remove(mantenimiento);
      return {
        message: 'Mantenimiento eliminado con éxito',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar el mantenimiento. Detalles: ${error.message}`,
      );
    }
  }
}
