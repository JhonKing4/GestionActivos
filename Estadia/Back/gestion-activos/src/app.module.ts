import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProveedorModule } from './proveedor/proveedor.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { MantenimientoModule } from './mantenimiento/mantenimiento.module';
import { HotelModule } from './hotel/hotel.module';
import { DepartamentoModule } from './departamento/departamento.module';
import { UsuarioModule } from './usuario/usuario.module';
import { MaterialModule } from './material/material.module';
import { AsignacionModule } from './asignacion/asignacion.module';
import { RelacionElementsModule } from './relacion-elements/relacion-elements.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProveedorModule,
    MantenimientoModule,
    HotelModule,
    DepartamentoModule,
    UsuarioModule,
    MaterialModule,
    AsignacionModule,
    RelacionElementsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
