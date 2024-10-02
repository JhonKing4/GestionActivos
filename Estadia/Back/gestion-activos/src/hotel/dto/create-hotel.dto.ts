import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateHotelDto {
  @ApiProperty({
    description: 'Nombre del hotel',
    uniqueItems: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
