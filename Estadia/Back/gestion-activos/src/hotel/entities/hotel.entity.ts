import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Hoteles' })
export class Hotel {
  @ApiProperty({
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    description: ' Hotel ID',
    uniqueItems: true,
    nullable: false,
  })
  @PrimaryGeneratedColumn('uuid')
  idHotel: string;

  @ApiProperty({
    example: 'Majestic Elegance Costa Mujeres',
    description: 'Nombre del hotel',
    uniqueItems: true,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;
}
