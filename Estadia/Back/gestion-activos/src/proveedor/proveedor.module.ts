import { Module } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ProveedorController } from './proveedor.controller';
import { Proveedor } from './entities/proveedor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor]), AuthModule],
  controllers: [ProveedorController],
  providers: [ProveedorService],
})
export class ProveedorModule {}
