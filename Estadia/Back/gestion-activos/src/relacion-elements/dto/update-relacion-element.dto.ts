import { PartialType } from '@nestjs/swagger';
import { CreateRelacionElementDto } from './create-relacion-element.dto';

export class UpdateRelacionElementDto extends PartialType(CreateRelacionElementDto) {}
