import { InputType } from '@nestjs/graphql';
import { ProviderSearchable } from './Provider.searchable';

@InputType()
export class GetProviderQueryDto extends ProviderSearchable {

}
