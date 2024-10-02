import { Module } from '@nestjs/common';
import { MantenimientoService } from './mantenimiento.service';
import { MantenimientoController } from './mantenimiento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mantenimiento } from './entities/mantenimiento.entity';
import { Material } from 'src/material/entities/material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mantenimiento, Material])],
  controllers: [MantenimientoController],
  providers: [MantenimientoService],
})
export class MantenimientoModule {}
