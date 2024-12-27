import { InputType } from '@nestjs/graphql';
import { UkraineRegionSearchable } from './UkraineRegion.searchable';

@InputType()
export class GetUkraineRegionQueryDto extends UkraineRegionSearchable {

}
