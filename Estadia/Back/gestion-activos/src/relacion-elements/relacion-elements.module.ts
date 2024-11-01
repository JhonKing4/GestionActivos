import { Module } from '@nestjs/common';
import { RelacionElementsService } from './relacion-elements.service';
import { RelacionElementsController } from './relacion-elements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelacionElement } from './entities/relacion-element.entity';
import { Material } from 'src/material/entities/material.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RelacionElement, Material]), AuthModule],
  controllers: [RelacionElementsController],
  providers: [RelacionElementsService],
})
export class RelacionElementsModule {}
