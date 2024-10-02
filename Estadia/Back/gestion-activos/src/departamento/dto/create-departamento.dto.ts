import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartamentoDto {
  @ApiProperty({
    description: 'Nombre del departamento o área',
    uniqueItems: false,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Una breve descripcion del área',
    uniqueItems: false,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
