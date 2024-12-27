import React from 'react';
import {GridColDef} from "@mui/x-data-grid";
import CustomList from "./List";
import {GET_FEED_SEGMENT} from "../../graphql/requests";

const FeedSegmentList: React.FC = () => {
    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Ідентифікатор', width: 160, sortable: false},
        {field: 'title', headerName: 'Сегмент', width: 200, sortable: false},
    ];

    return <>
        <CustomList
            itemsPerPage={10}
            columns={columns}
            query={GET_FEED_SEGMENT}
            queryKey={'getFeedSegments'}
            subscribeAddress={'feed-segments/sse'}
        />
    </>
};

export default FeedSegmentList;