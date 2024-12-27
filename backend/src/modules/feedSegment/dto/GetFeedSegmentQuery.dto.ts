import { InputType } from '@nestjs/graphql';
import { FeedSegmentSearchable } from './FeedSegment.searchable';

@InputType()
export class GetFeedSegmentQueryDto extends FeedSegmentSearchable {
}