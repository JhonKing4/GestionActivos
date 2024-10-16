import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Hotel } from './entities/hotel.entity';

@ApiTags('Hoteles')
@Controller('hoteles')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo Hotel ' })
  @ApiResponse({
    status: 201,
    description: 'Hotel creado con éxito',
    type: Hotel,
  })
  @ApiResponse({
    status: 400,
    description: 'Mala petición. Ya existe un Hotel con este nombre.',
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async create(@Body() createHotelDto: CreateHotelDto): Promise<Hotel> {
    return await this.hotelService.create(createHotelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los hoteles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de hoteles obtenida con éxito',
    type: [Hotel],
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  findAll(): Promise<Hotel[]> {
    return this.hotelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: ' Obtener un hotel por ID' })
  @ApiResponse({
    status: 200,
    description: 'Hotel encontrado con éxito',
    type: Hotel,
  })
  @ApiResponse({ status: 404, description: 'Hotel no encontrado' })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  findOne(@Param('id') id: string): Promise<Hotel> {
    return this.hotelService.findOne(id);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un Hotel por ID' })
  @ApiResponse({
    status: 200,
    description: 'Hotel actualizado con éxito',
    type: Hotel,
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel no encontrado',
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async update(
    @Param('id') id: string,
    @Body() updateHotelDto: CreateHotelDto,
  ) {
    return await this.hotelService.update(id, updateHotelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un Hotel por ID' })
  @ApiResponse({
    status: 200,
    description: 'Hotel eliminado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel no encontrado',
  })
  @ApiResponse({ status: 500, description: 'Ocurrió un error en el servidor' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.hotelService.remove(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Buscar hoteles por nombre' })
  @ApiResponse({
    status: 200,
    description: 'Hoteles encontrados con éxito',
    type: [Hotel],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron hoteles con ese nombre',
  })
  findByName(@Param('name') name: string): Promise<Hotel[]> {
    return this.hotelService.findByName(name);
  }
}
