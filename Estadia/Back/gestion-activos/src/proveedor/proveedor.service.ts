import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { Proveedor } from './entities/proveedor.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) { }

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    const proveedor = this.proveedorRepository.create(createProveedorDto);
    return this.proveedorRepository.save(proveedor);
  }

  findAll(): Promise<Proveedor[]> {
    return this.proveedorRepository.find();
  }

  async findOne(id: string): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { idProveedor: id },
    });
    if (!proveedor) {
      throw new NotFoundException(`Proveedor con el id ${id} no encontrado`);
    }
    return proveedor;
  }

  async update(
    id: string,
    updateProveedorDto: CreateProveedorDto,
  ): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.preload({
      idProveedor: id,
      ...updateProveedorDto,
    });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }
    return this.proveedorRepository.save(proveedor);
  }

  async remove(id: string): Promise<void> {
    const proveedor = await this.findOne(id);
    await this.proveedorRepository.remove(proveedor);
  }

  async findByNameEmailPhone(searchTerm: string): Promise<Proveedor[]> {
    const proveedors = await this.proveedorRepository.find({
      where: [
        { name: ILike(`%${searchTerm}`) },
        { email: ILike(`%${searchTerm}`) },
        { phone: ILike(`%${searchTerm}`) },
        { rfc: ILike(`%${searchTerm}`) },
      ],
    });

    if (!proveedors.length) {
      throw new NotFoundException(
        `No se encontraron Proveedores con el criterio ${searchTerm}`,
      );
    }
    return proveedors;
  }
}
