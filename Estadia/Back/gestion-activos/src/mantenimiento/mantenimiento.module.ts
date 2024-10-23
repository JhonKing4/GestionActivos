import { Module } from '@nestjs/common';
import { MantenimientoService } from './mantenimiento.service';
import { MantenimientoController } from './mantenimiento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mantenimiento } from './entities/mantenimiento.entity';
import { Material } from 'src/material/entities/material.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mantenimiento, Material]), AuthModule],
  controllers: [MantenimientoController],
  providers: [MantenimientoService],
})
export class MantenimientoModule {}
