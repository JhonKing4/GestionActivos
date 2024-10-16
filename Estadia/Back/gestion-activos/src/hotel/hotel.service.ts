import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) { }

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const hotel = this.hotelRepository.create(createHotelDto);
    return this.hotelRepository.save(hotel);
  }

  findAll(): Promise<Hotel[]> {
    return this.hotelRepository.find();
  }

  async findOne(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { idHotel: id },
    });
    if (!hotel) {
      throw new NotFoundException(`Hotel con ${id} no encontrado`);
    }
    return hotel;
  }

  async update(id: string, UpdateHotelDto: CreateHotelDto): Promise<Hotel> {
    const hotel = await this.hotelRepository.preload({
      idHotel: id,
      ...UpdateHotelDto,
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel con ID ${id} no encontrado`);
    }
    return this.hotelRepository.save(hotel);
  }

  async remove(id: string): Promise<void> {
    const hotel = await this.findOne(id);
    await this.hotelRepository.remove(hotel);
  }

  async findByName(name: string): Promise<Hotel[]> {
    if (!name) {
      return this.hotelRepository.find();
    }
    return this.hotelRepository.find({
      where: { name: ILike(`%${name}%`) },
    });
  }
}
