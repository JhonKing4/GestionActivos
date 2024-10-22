import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamento } from './entities/departamento.entity';
import { ILike, Repository } from 'typeorm';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';

@Injectable()
export class DepartamentoService {
  constructor(
    @InjectRepository(Departamento)
    private departamentoRepository: Repository<Departamento>,
  ) {}

  async create(
    createDepartamentoDto: CreateDepartamentoDto,
  ): Promise<Departamento> {
    const departamento = this.departamentoRepository.create(
      createDepartamentoDto,
    );
    return this.departamentoRepository.save(departamento);
  }

  finAll(): Promise<Departamento[]> {
    return this.departamentoRepository.find();
  }

  async findOne(id: string): Promise<Departamento> {
    const departamento = await this.departamentoRepository.findOne({
      where: { idDepartamento: id },
    });
    if (!departamento) {
      throw new NotFoundException(`Departamento con el id ${id} no encontrado`);
    }
    return departamento;
  }

  async update(
    id: string,
    updateDepartamentoDto: CreateDepartamentoDto,
  ): Promise<Departamento> {
    const departamento = await this.departamentoRepository.preload({
      idDepartamento: id,
      ...updateDepartamentoDto,
    });

    if (!Proveedor) {
      throw new NotFoundException(`Departamento con el id ${id} no encontrado`);
    }
    return this.departamentoRepository.save(departamento);
  }

  async remove(id: string): Promise<void> {
    const departamento = await this.findOne(id);
    await this.departamentoRepository.remove(departamento);
  }

  async findByName(name: string): Promise<Departamento[]> {
    if (!name) {
      return this.departamentoRepository.find();
    }
    return this.departamentoRepository.find({
      where: { name: ILike(`%${name}`) },
    });
  }
}
