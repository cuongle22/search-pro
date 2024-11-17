import { PartialType } from '@nestjs/swagger';
import { StoreCreationDto } from './store-creation.dto';

export class StoreUpdatingDto extends PartialType(StoreCreationDto) {}
