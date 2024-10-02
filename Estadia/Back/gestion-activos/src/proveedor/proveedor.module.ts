import { Module } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ProveedorController } from './proveedor.controller';
import { Proveedor } from './entities/proveedor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor])],
  controllers: [ProveedorController],
  providers: [ProveedorService],
})
export class ProveedorModule {}
