import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelacionElement } from './entities/relacion-element.entity';
import { CreateRelacionElementDto } from './dto/create-relacion-element.dto';
import { Material } from '../material/entities/material.entity';

@Injectable()
export class RelacionElementsService {
  constructor(
    @InjectRepository(RelacionElement)
    private relacionElementRepository: Repository<RelacionElement>,
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
  ) {}

  async create(
    createRelacionElementDto: CreateRelacionElementDto,
  ): Promise<any> {
    const materialPadre = await this.materialRepository.findOne({
      where: { idMaterial: createRelacionElementDto.fk_material_padre },
    });

    if (!materialPadre) {
      throw new Error('Material padre no encontrado');
    }

    const materialHijos = await this.materialRepository.findByIds(
      createRelacionElementDto.fk_material_hijos,
    );

    if (
      materialHijos.length !== createRelacionElementDto.fk_material_hijos.length
    ) {
      throw new Error('Uno o más materiales hijos no fueron encontrados');
    }

    const relacionElement = this.relacionElementRepository.create({
      materialPadre,
      materialHijos: materialHijos.map((material) => material.idMaterial),
      amount: createRelacionElementDto.amount,
    });

    const nuevaRelacion =
      await this.relacionElementRepository.save(relacionElement);

    return {
      idRelacionElement: nuevaRelacion.idRelacionElement,
      amount: nuevaRelacion.amount,
      materialPadre,
      materialesHijos: materialHijos,
    };
  }

  async findAll(): Promise<RelacionElement[]> {
    const relaciones = await this.relacionElementRepository.find();

    return Promise.all(
      relaciones.map(async (relacion) => {
        const materialPadre = await this.materialRepository.findOne({
          where: { idMaterial: relacion.materialPadre as any },
        });

        const materialesHijos = await this.materialRepository.findByIds(
          relacion.materialHijos,
        );

        return {
          ...relacion,
          materialPadre,
          materialesHijos,
        };
      }),
    );
  }

  async findOne(id: string): Promise<any> {
    const relacion = await this.relacionElementRepository.findOne({
      where: { idRelacionElement: id },
    });

    if (!relacion) {
      throw new NotFoundException('Relación no encontrada');
    }

    const materialPadre = await this.materialRepository.findOne({
      where: { idMaterial: relacion.materialPadre as any },
    });

    if (!materialPadre) {
      throw new NotFoundException('Material padre no encontrado');
    }

    const materialesHijos = await this.materialRepository.findByIds(
      relacion.materialHijos,
    );

    return {
      idRelacionElement: relacion.idRelacionElement,
      amount: relacion.amount,
      materialPadre,
      materialesHijos,
    };
  }

  async update(
    id: string,
    updateRelacionElementDto: CreateRelacionElementDto,
  ): Promise<any> {
    const relacionExistente = await this.relacionElementRepository.findOne({
      where: { idRelacionElement: id },
      relations: ['materialPadre'],
    });

    if (!relacionExistente) {
      throw new Error('Relación no encontrada');
    }

    relacionExistente.amount = updateRelacionElementDto.amount;

    const nuevosMaterialesHijos = await this.materialRepository.findByIds(
      updateRelacionElementDto.fk_material_hijos || [],
    );

    if (
      nuevosMaterialesHijos.length !==
      updateRelacionElementDto.fk_material_hijos.length
    ) {
      throw new Error('Uno o más materiales hijos no encontrados');
    }

    relacionExistente.materialHijos = nuevosMaterialesHijos.map(
      (material) => material.idMaterial,
    );

    if (updateRelacionElementDto.fk_material_padre) {
      const materialPadre = await this.materialRepository.findOne({
        where: { idMaterial: updateRelacionElementDto.fk_material_padre },
      });

      if (!materialPadre) {
        throw new Error('Material padre no encontrado');
      }

      relacionExistente.materialPadre = materialPadre;
    }

    await this.relacionElementRepository.save(relacionExistente);

    const materialPadre = await this.materialRepository.findOne({
      where: { idMaterial: relacionExistente.materialPadre.idMaterial },
    });

    return {
      idRelacionElement: relacionExistente.idRelacionElement,
      amount: relacionExistente.amount,
      materialPadre,
      materialesHijos: nuevosMaterialesHijos,
    };
  }

  async remove(id: string): Promise<void> {
    await this.relacionElementRepository.delete(id);
  }
}