import { ApiProperty } from '@nestjs/swagger';
import { Material } from 'src/material/entities/material.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TypeMaintenance } from '../enum/type_maintenance.enum';

@Entity({ name: 'mantenimientos' })
export class Mantenimiento {
  @ApiProperty({
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    description: 'El ID de Mantenimiento',
    uniqueItems: true,
    nullable: false,
  })
  @PrimaryGeneratedColumn('uuid')
  idMantenimiento: string;

  @ApiProperty({
    example: 'Este va ser un mantenimiento preventivo, por X cosa',
    description: 'Una descripcion breve sobre el mantenimiento',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 50, unique: false, nullable: true })
  description: string;

  @ApiProperty({
    example: '2024-09-14',
    description: 'La fecha de inicio del mantenimiento',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'date', unique: false, nullable: false })
  startDate: Date;

  @ApiProperty({
    example: '2024-10-01',
    description: 'La fecha de salida del mantenimiento',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'date', unique: false, nullable: false })
  endDate: Date;

  @ApiProperty({
    type: [Material],
    description: 'Lista de materiales asociados al mantenimiento',
    nullable: false,
  })
  @OneToMany(() => Material, (material) => material.mantenimiento, {
    cascade: ['update', 'remove'],
    nullable: false,
  })
  materials: Material[];

  @ApiProperty({
    example: 0,
    description: 'Enum para el tipo de mantenimiento',
    enum: TypeMaintenance,
    uniqueItems: false,
    nullable: false,
  })
  @Column({
    type: 'enum',
    enum: TypeMaintenance,
    unique: false,
    nullable: false,
  })
  typeMaintenance: number;
}
