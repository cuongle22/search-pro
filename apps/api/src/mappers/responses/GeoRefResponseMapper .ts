import { GeoRefEntity } from '~/entities';
import { GeoRefResponseDto } from '~/share/dtos';
import { BaseMapper } from '../base/BaseMapper';

export class GeoRefResponseMapper extends BaseMapper<
  GeoRefEntity,
  GeoRefResponseDto
> {
  map(source: GeoRefEntity): GeoRefResponseDto {
    const geoRefResponseDto: GeoRefResponseDto = {
      id: source.id,
      zipCode: source.zipCode,
      steName: source.steName,
    };
    return geoRefResponseDto;
  }
}
