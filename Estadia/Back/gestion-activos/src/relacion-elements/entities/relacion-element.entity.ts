import { ApiProperty } from '@nestjs/swagger';
import { Material } from 'src/material/entities/material.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'relacion_element' })
export class RelacionElement {
  @ApiProperty({
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    description: 'ID de la relación entre los materiales',
    uniqueItems: true,
    nullable: false,
  })
  @PrimaryGeneratedColumn('uuid')
  idRelacionElement: string;

  @ApiProperty({
    description: 'Material Padre de la relación',
    type: Material,
  })
  @ManyToOne(() => Material, { nullable: false })
  materialPadre: Material;

  @ApiProperty({
    description: 'IDs de los Materiales Hijos de la relación',
    type: [String],
  })
  @Column('uuid', { array: true, nullable: true })
  materialHijos: string[];

  @ApiProperty({
    example: 10,
    description: 'Cantidad relacionada entre el Material Padre y los Hijos',
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  amount: number;
}
