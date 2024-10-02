import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'departamentos' })
export class Departamento {
  @ApiProperty({
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    description: 'Departamento ID',
    uniqueItems: true,
    nullable: false,
  })
  @PrimaryGeneratedColumn('uuid')
  idDepartamento: string;

  @ApiProperty({
    example: 'Sistemas',
    description: 'Nombre del departamento o área',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 100, unique: false, nullable: false })
  name: string;

  @ApiProperty({
    example: 'Es el área de sistema',
    description: 'Una descripción breve',
    uniqueItems: true,
    nullable: false,
  })
  @Column({ type: 'varchar', unique: false, nullable: false })
  description: string;
}
