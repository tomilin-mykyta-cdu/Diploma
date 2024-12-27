import { InputType } from '@nestjs/graphql';
import { FeedTitleSearchable } from './FeedTitle.searchable';

@InputType()
export class GetFeedTitleQuery extends FeedTitleSearchable {
}