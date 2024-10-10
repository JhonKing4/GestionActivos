import { ApiProperty } from '@nestjs/swagger';
import { Material } from '../../material/entities/material.entity';

export class RelacionElementResponseDto {
  @ApiProperty({
    example: 'b7ba0f09-5a6e-4146-93c2-0c9b934162fe',
    description: 'ID de la Relación de Elementos',
  })
  idRelacionElement: string;

  @ApiProperty({
    description: 'Objeto del Material Padre',
    type: Material,
  })
  materialPadre: Material;

  @ApiProperty({
    description: 'Lista de Materiales Hijos',
    type: [Material],
  })
  materialesHijos: Material[];

  @ApiProperty({
    example: 10,
    description: 'Cantidad relacionada entre el Material Padre y los Hijos',
  })
  amount: number;
}
