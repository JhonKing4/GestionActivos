import { Module } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { DepartamentoController } from './departamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from './entities/departamento.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Departamento]), AuthModule],
  controllers: [DepartamentoController],
  providers: [DepartamentoService],
})
export class DepartamentoModule {}
