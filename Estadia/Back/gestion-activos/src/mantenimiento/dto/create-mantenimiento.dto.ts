import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { TypeMaintenance } from '../enum/type_maintenance.enum';

export class CreateMantenimientoDto {
  @ApiProperty({
    description: 'Poner algunos comentarios sobre el mantenimiento',
    uniqueItems: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'La fecha de Inicio',
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'La fecha de finalización',
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({
    example: 0,
    description: 'Enum de los tipos de mantenimientos',
    enum: TypeMaintenance,
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty({ message: 'El campo no puede estar vacío' })
  @IsInt({ message: 'Tipo de mantenimiento debe ser un numero entero' })
  @Min(0, { message: 'El valor no debe ser menor a 0' })
  @Max(1, { message: 'El valor no puede ser mayor a 1' })
  typeMaintenance: number;

  @ApiProperty({
    description: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    nullable: false,
    type: [String],
    isArray: true,
  })
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  materials: string[];
}
