import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../entities/usuario.entity';

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de acceso JWT',
  })
  access_token: string;

  @ApiProperty({
    description: 'Datos del usuario',
    type: Usuario,
  })
  usuario: Usuario;
}
