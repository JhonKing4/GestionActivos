import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Roles } from '../enums/roles.enum';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 0,
    description: 'Enum de los roles, poner solo un valor',
    enum: Roles,
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty({ message: 'El campo no puede estar vacío' })
  @IsInt({ message: 'Rol debe ser un numero entero' })
  @Min(0, { message: 'El valor no debe ser menor a 0' })
  @Max(2, { message: 'El numero no puede ser mayor a 2' })
  roles: number;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    uniqueItems: false,
    nullable: false,
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Colocar la contraseña',
    uniqueItems: false,
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Correo electronico',
    uniqueItems: true,
    nullable: false,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Colocar el numero de colaborador',
    uniqueItems: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  numberColaborador: string;

  @ApiProperty({
    description: 'Nombre de la empresa',
    uniqueItems: false,
    nullable: false,
  })
  @IsString()
  @MaxLength(100)
  companyname: string;
}
