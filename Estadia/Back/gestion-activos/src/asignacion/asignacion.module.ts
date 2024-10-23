import { Module } from '@nestjs/common';
import { AsignacionService } from './asignacion.service';
import { AsignacionController } from './asignacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignacion } from './entities/asignacion.entity';
import { Material } from 'src/material/entities/material.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Asignacion,
      Material,
      Usuario,
      Hotel,
      Departamento,
    ]),
    AuthModule,
  ],
  controllers: [AsignacionController],
  providers: [AsignacionService],
})
export class AsignacionModule {}
