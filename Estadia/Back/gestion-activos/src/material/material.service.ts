import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from './entities/material.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';
import { Departamento } from 'src/departamento/entities/departamento.entity';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    const { hotelId, proveedorId, departamentoId, ...materialData } =
      createMaterialDto;

    const hotel = await this.hotelRepository.findOne({
      where: { idHotel: hotelId },
    });
    if (!hotel)
      throw new NotFoundException(`Hotel with ID ${hotelId} not found`);

    const proveedor = await this.proveedorRepository.findOne({
      where: { idProveedor: proveedorId },
    });
    if (!proveedor)
      throw new NotFoundException(`Proveedor with ID ${proveedorId} not found`);

    const departamento = await this.departamentoRepository.findOne({
      where: { idDepartamento: departamentoId },
    });
    if (!departamento)
      throw new NotFoundException(
        `Departamento with ID ${departamentoId} not found`,
      );

    const material = this.materialRepository.create({
      ...materialData,
      hotel,
      proveedor,
      departamento,
    });

    return await this.materialRepository.save(material);
  }

  async findAll(): Promise<Material[]> {
    return await this.materialRepository.find({
      relations: ['hotel', 'proveedor', 'departamento'],
    });
  }

  async findOne(id: string): Promise<Material> {
    const material = await this.materialRepository.findOne({
      where: { idMaterial: id },
      relations: ['hotel', 'proveedor', 'departamento'],
    });

    if (!material)
      throw new NotFoundException(`Material with ID ${id} not found`);
    return material;
  }

  async update(
    id: string,
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    const { hotelId, proveedorId, departamentoId, ...materialData } =
      updateMaterialDto;

    const material = await this.materialRepository.findOne({
      where: { idMaterial: id },
    });
    if (!material)
      throw new NotFoundException(`Material with ID ${id} not found`);

    if (hotelId) {
      const hotel = await this.hotelRepository.findOne({
        where: { idHotel: hotelId },
      });
      if (!hotel)
        throw new NotFoundException(`Hotel with ID ${hotelId} not found`);
      material.hotel = hotel;
    }

    if (proveedorId) {
      const proveedor = await this.proveedorRepository.findOne({
        where: { idProveedor: proveedorId },
      });
      if (!proveedor)
        throw new NotFoundException(
          `Proveedor with ID ${proveedorId} not found`,
        );
      material.proveedor = proveedor;
    }

    if (departamentoId) {
      const departamento = await this.departamentoRepository.findOne({
        where: { idDepartamento: departamentoId },
      });
      if (!departamento)
        throw new NotFoundException(
          `Departamento with ID ${departamentoId} not found`,
        );
      material.departamento = departamento;
    }

    Object.assign(material, materialData);
    return await this.materialRepository.save(material);
  }

  async remove(id: string): Promise<void> {
    const material = await this.materialRepository.findOne({
      where: { idMaterial: id },
    });
    if (!material)
      throw new NotFoundException(`Material with ID ${id} not found`);

    await this.materialRepository.remove(material);
  }

  async findByMaterialSearchTerm(searchTerm: string): Promise<Material[]> {
    const queryBuilder = this.materialRepository.createQueryBuilder('material');

    queryBuilder
      .leftJoinAndSelect('material.hotel', 'hotel')
      .leftJoinAndSelect('material.proveedor', 'proveedor')
      .leftJoinAndSelect('material.departamento', 'departamento')
      .leftJoinAndSelect('material.asignacion', 'asignacion')
      .leftJoinAndSelect('material.mantenimiento', 'mantenimiento');

    const isUUID = searchTerm.match(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    );
    if (isUUID) {
      queryBuilder.where('material.idMaterial = :searchTerm', { searchTerm });
    } else {
      queryBuilder.where('material.name ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });

      queryBuilder.orWhere('material.model ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });

      queryBuilder.orWhere('material.serial_number ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });

      const isDate = !isNaN(Date.parse(searchTerm));
      if (isDate) {
        queryBuilder.orWhere(
          'CAST(material.expiration_date AS TEXT) = :searchTerm',
          { searchTerm },
        );
        queryBuilder.orWhere(
          'CAST(material.purchase_date AS TEXT) = :searchTerm',
          { searchTerm },
        );
      }

      const isNumber = !isNaN(Number(searchTerm));
      if (isNumber) {
        queryBuilder.orWhere('material.stock = :searchTerm', {
          searchTerm: Number(searchTerm),
        });
        queryBuilder.orWhere('material.elementsType = :searchTerm', {
          searchTerm: Number(searchTerm),
        });
        queryBuilder.orWhere('material.status = :searchTerm', {
          searchTerm: Number(searchTerm),
        });
        queryBuilder.orWhere('material.materialtype = :searchTerm', {
          searchTerm: Number(searchTerm),
        });
      }

      queryBuilder.orWhere('material.description ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });

      queryBuilder.orWhere('hotel.name ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });

      queryBuilder.orWhere('proveedor.name ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });

      queryBuilder.orWhere('departamento.name ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });
    }

    const materiales = await queryBuilder.getMany();

    if (!materiales.length) {
      throw new NotFoundException(
        `No se encontraron materiales con el criterio ${searchTerm}`,
      );
    }

    return materiales;
  }
}
