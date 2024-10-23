import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Material, Hotel, Proveedor, Departamento]),
    AuthModule,
  ],
  controllers: [MaterialController],
  providers: [MaterialService],
})
export class MaterialModule {}
