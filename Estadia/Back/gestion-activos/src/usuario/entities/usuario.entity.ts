import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../enums/roles.enum';

@Entity({ name: 'Usuarios' })
export class Usuario {
  @ApiProperty({
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    description: 'Usuario ID',
    uniqueItems: true,
    nullable: false,
  })
  @PrimaryGeneratedColumn('uuid')
  idUsuario: string;

  @ApiProperty({
    example: 'Juana de la Santísima Cruz.',
    description: 'Colocar el nombre completo',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 100, unique: false, nullable: false })
  name: string;

  @ApiProperty({
    example: '93207926',
    description: 'Número de colaborador único',
    uniqueItems: true,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 8, unique: true, nullable: false })
  numberColaborador: string;

  @ApiProperty({
    example: 'majestic@gmail.com',
    description: 'Correo electronico',
    uniqueItems: true,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @ApiProperty({
    example: 't$PaTd9c',
    description: 'Colocar una contraseña segura',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 20, unique: false, nullable: false })
  password: string;

  @ApiProperty({
    example: 0,
    enum: Roles,
    description: 'Enum los roles, poner solo un valor, por ejemplo 0',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'enum', enum: Roles, unique: false, nullable: false })
  roles: number;

  @ApiProperty({
    example: 'Aruba',
    description: 'Colocar el nombre de la empresa',
    uniqueItems: false,
    nullable: false,
  })
  @Column({ type: 'varchar', length: 100, unique: false, nullable: false })
  companyname: string;
}
