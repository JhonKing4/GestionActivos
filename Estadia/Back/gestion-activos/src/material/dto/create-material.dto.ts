import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Elements } from '../enum/element_type.enum';
import { Status } from '../enum/status.enum';
import { MaterialesType } from '../enum/material_type.enum';

export class CreateMaterialDto {
  @ApiProperty({
    description: 'Nombre del material',
    uniqueItems: false,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Numero o nombre de modelo ó version',
    uniqueItems: false,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    description: 'Numero de serie',
    uniqueItems: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  serial_number: string;

  @ApiProperty({
    description: 'Numero de existencias',
    uniqueItems: false,
    nullable: false,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    description: 'Fecha de expiración',
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty()
  @IsDateString()
  expiration_date: string;

  @ApiProperty({
    description: 'Fecha de compra',
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty()
  @IsDateString()
  purchase_date: string;

  @ApiProperty({
    description: 'Breve descripcion del material',
    uniqueItems: false,
    nullable: false,
  })
  @IsString()
  @MaxLength(50)
  description: string;

  @ApiProperty({
    example: 0,
    description: 'Enum de los tipos de materiales',
    enum: Elements,
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty({ message: 'El campo no puede estar vacío' })
  @IsInt({ message: 'Rol debe ser un numero entero' })
  @Min(0, { message: 'El valor no debe ser menor a 0' })
  @Max(1, { message: 'El numero no puede ser mayor a 1' })
  elementsType: number;

  @ApiProperty({
    example: 0,
    description: 'Enum los estados del material',
    enum: Status,
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty({ message: 'El campo no puede estar vacío' })
  @IsInt({ message: 'Rol debe ser un numero entero' })
  @Min(0, { message: 'El valor no debe ser menor a 0' })
  @Max(2, { message: 'El numero no puede ser mayor a 2' })
  status: number;

  @ApiProperty({
    example: 0,
    description: 'Enum para la jerarquia del material',
    enum: MaterialesType,
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty({ message: 'El campo no puede estar vacío' })
  @IsInt({ message: 'Rol debe ser un numero entero' })
  @Min(0, { message: 'El valor no debe ser menor a 0' })
  @Max(1, { message: 'El numero no puede ser mayor a 1' })
  materialtype: number;

  @ApiProperty({
    description: 'ID del hotel relacionado',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  hotelId: string;

  @ApiProperty({
    description: 'ID del proveedor relacionado',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  proveedorId: string;

  @ApiProperty({
    description: 'ID del departamento relacionado',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  departamentoId: string;
}
