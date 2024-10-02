import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusAsig } from '../enum/statusAsig.enum';
import { Material } from 'src/material/entities/material.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';

@Entity({ name: 'Asignaciones' })
export class Asignacion {
  @ApiProperty({
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    description: 'ID de la asignación',
    uniqueItems: true,
    nullable: false,
  })
  @PrimaryGeneratedColumn('uuid')
  idAsignacion: string;

  @ApiProperty({
    example: '2024-09-20',
    description: 'Fecha de inicio de las asignación',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'date', unique: false, nullable: false })
  assignmentDate: Date;

  @ApiProperty({
    example: '2024-11-19',
    description: 'Fecha de Finalización de la asignación',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'date', unique: false, nullable: false })
  returnDate: Date;

  @ApiProperty({
    example: 'Solo son 2 materiales',
    description: 'Agregar una observacion breve',
    uniqueItems: false,
    nullable: true,
  })
  @Column({ type: 'varchar', length: 50, unique: false, nullable: true })
  observation: string;

  @ApiProperty({
    example: 0,
    description: 'Enum del estado de la asignacion',
    enum: StatusAsig,
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'enum', enum: StatusAsig, unique: false, nullable: false })
  statusAsig: number;

  @ApiProperty({
    type: Material,
    description: 'ID de material',
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    nullable: false,
  })
  @OneToMany(() => Material, (material) => material.asignacion, {
    nullable: false,
  })
  material: Material[];

  @ApiProperty({
    type: Usuario,
    description: 'ID de Usuario',
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    nullable: false,
  })
  @ManyToOne(() => Usuario, (usuario) => usuario.name, {
    nullable: false,
  })
  usuario: Usuario;

  @ApiProperty({
    type: Departamento,
    description: 'Id del departamento',
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    nullable: false,
  })
  @ManyToOne(() => Departamento, (departamento) => departamento.name, {
    nullable: false,
  })
  departamento: Departamento;

  @ApiProperty({
    type: Hotel,
    description: 'ID del hotel',
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    nullable: false,
  })
  @ManyToOne(() => Hotel, (hotel) => hotel.name, {
    nullable: false,
  })
  hotel: Hotel;
}
