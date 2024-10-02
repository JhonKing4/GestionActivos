import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: '',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: '',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
