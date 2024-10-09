import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Elements } from '../enum/element_type.enum';
import { Status } from '../enum/status.enum';
import { MaterialesType } from '../enum/material_type.enum';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { Mantenimiento } from 'src/mantenimiento/entities/mantenimiento.entity';

@Entity({ name: 'materiales' })
export class Material {
  @ApiProperty({
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    description: 'El ID de Material',
    uniqueItems: true,
    nullable: false,
  })
  @PrimaryGeneratedColumn('uuid')
  idMaterial: string;

  @ApiProperty({
    example: 'Laptop Hp',
    description: 'El nombre del material',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 50, unique: false, nullable: false })
  name: string;

  @ApiProperty({
    example: 'IdeaPad L340',
    description: 'El modelo o versión del material',
    uniqueItems: true,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  model: string;

  @ApiProperty({
    example: '0120345874',
    description: 'Es el numero de serie del material',
    uniqueItems: true,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  serial_number: string;

  @ApiProperty({
    example: '20',
    description: 'El numero de existencias',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'integer', unique: false, nullable: false })
  stock: number;

  @ApiProperty({
    example: '2025-02-15',
    description:
      'La fecha de vencimiento de garantia o fecha de vencimiento de licencia',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'date', unique: false, nullable: false })
  expiration_date: Date;

  @ApiProperty({
    example: '2024-09-20',
    description: 'Es la fecha que se compro el material',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'date', unique: false, nullable: false })
  purchase_date: Date;

  @ApiProperty({
    example: 'Tiene una tecla que no funciona',
    description: 'Escribir una descripcion breve sobre el material',
    uniqueItems: false,
    nullable: true,
  })
  @Column({ type: 'varchar', length: 50, unique: false, nullable: true })
  description: string;

  @ApiProperty({
    example: 0,
    description: 'Enum el tipo de los materiales',
    enum: Elements,
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'enum', enum: Elements, unique: false, nullable: false })
  elementsType: number;

  @ApiProperty({
    example: 0,
    description: 'Enum el estado del material',
    enum: Status,
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'enum', enum: Status, unique: false, nullable: false })
  status: number;

  @ApiProperty({
    example: 0,
    description: 'Enum el tipo de material',
    enum: MaterialesType,
    uniqueItems: false,
    nullable: false,
  })
  @Column({
    type: 'enum',
    enum: MaterialesType,
    unique: false,
    nullable: false,
  })
  materialtype: number;

  @ApiProperty({
    type: Hotel,
    description: 'El ID del hotel para que se haga la relación',
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    nullable: false,
  })
  @ManyToOne(() => Hotel, (hotel) => hotel.name, {
    nullable: false,
  })
  hotel: Hotel;

  @ApiProperty({
    type: Proveedor,
    description: 'El ID del proveedor',
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    nullable: false,
  })
  @ManyToOne(() => Proveedor, (proveedor) => proveedor.name, {
    nullable: false,
  })
  proveedor: Proveedor;

  @ApiProperty({
    type: Departamento,
    description: 'El ID del departamento o área',
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    nullable: false,
  })
  @ManyToOne(() => Departamento, (departamento) => departamento.name, {
    nullable: false,
  })
  departamento: Departamento;

  @ManyToOne(() => Asignacion, (asignacion) => asignacion.material, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  asignacion: Asignacion;
  @ManyToOne(() => Mantenimiento, (mantenimiento) => mantenimiento.materials, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  mantenimiento: Mantenimiento;
}
