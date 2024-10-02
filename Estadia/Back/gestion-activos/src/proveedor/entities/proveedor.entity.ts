import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'proveedores' })
export class Proveedor {
  @ApiProperty({
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    description: 'Proveedor ID',
    uniqueItems: true,
    nullable: false,
  })
  @PrimaryGeneratedColumn('uuid')
  idProveedor: string;

  @ApiProperty({
    example: 'Microsoft',
    description: 'Nombre completo del proveedor',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 100, unique: false, nullable: false })
  name: string;

  @ApiProperty({
    example: '9981474849',
    description: 'Numero de Telefono',
    uniqueItems: true,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  phone: string;

  @ApiProperty({
    example:
      'Carretera Libre 85 Punta Sam, Isla Blanca 85 SM6, Manzana 2 Playa Mujeres, 77400 Costa Mujeres, Q.R.',
    description: 'Dirección completa',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 150, unique: false, nullable: false })
  address: string;

  @ApiProperty({
    example: 'majestic@gmail.com',
    description: 'Correo electronico',
    uniqueItems: true,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @ApiProperty({
    example: 'RDL0904102F4',
    description: 'RFC de la empresa',
    uniqueItems: true,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 12, unique: true, nullable: false })
  rfc: string;
}
