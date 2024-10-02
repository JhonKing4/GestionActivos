import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateRelacionElementDto {
  @ApiProperty({
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    description: 'ID del Material Padre',
    nullable: false,
  })
  @IsNotEmpty({ message: 'El Material Padre no puede estar vacío' })
  @IsUUID()
  fk_material_padre: string;

  @ApiProperty({
    example: ['b7ba0f09-5a6e-4146-93c2-0c9b934162ff'],
    description: 'IDs de los Materiales Hijos',
    nullable: false,
    isArray: true,
    type: [String],
  })
  @IsNotEmpty({ message: 'El Material Hijo no puede estar vacío' })
  @IsUUID('all', { each: true })
  fk_material_hijos: string[];

  @ApiProperty({
    example: 10,
    description: 'Cantidad relacionada entre el Material Padre y los Hijos',
    nullable: false,
  })
  @IsNotEmpty({ message: 'La cantidad no puede estar vacía' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  amount: number;
}
