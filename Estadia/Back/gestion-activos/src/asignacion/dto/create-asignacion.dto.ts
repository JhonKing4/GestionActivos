import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { StatusAsig } from '../enum/statusAsig.enum';

export class CreateAsignacionDto {
  @ApiProperty({
    description: 'Fecha de inicio de la aasignación',
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty()
  @IsDateString()
  assignmentDate: string;

  @ApiProperty({
    description: 'Fecha de finalzación de la asignación',
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty()
  @IsDateString()
  returnDate: string;

  @ApiProperty({
    description: 'Observacion o descripcion de la asignación',
    uniqueItems: false,
    nullable: true,
  })
  @IsString()
  @MaxLength(50)
  observation: string;

  @ApiProperty({
    example: 0,
    description: 'Enum de los estados de asignación',
    enum: StatusAsig,
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty({ message: 'El campo no puede estar vacío' })
  @IsInt({ message: 'El estado de la asignacion debe ser entero' })
  @Min(0, { message: ' El valor no debe ser menor a 0' })
  @Max(3, { message: 'El valor no puede ser mayor a 3' })
  statusAsig: number;

  @ApiProperty({
    description: 'IDs del Material relacionado',
    nullable: false,
    isArray: true,
    type: [String],
  })
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  materialId: string[];

  @ApiProperty({
    description: 'ID del Usuario relacionado',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;

  @ApiProperty({
    description: 'ID del departamento relacionado',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  departamentoId: string;

  @ApiProperty({
    description: 'ID del Hotel relacionado',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  hotelId: string;
}
