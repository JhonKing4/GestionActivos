import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty({
    description: 'Nombre del proveedor',
    uniqueItems: false,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Numero de Celular',
    uniqueItems: true,
    nullable: false,
  })
  @IsString()
  @Length(10)
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Dirección completa',
    uniqueItems: false,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Correo electronico',
    uniqueItems: true,
    nullable: false,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'RFC de la empresa',
    uniqueItems: true,
    nullable: false,
  })
  @IsString()
  @Length(13)
  @IsNotEmpty()
  rfc: string;
}
