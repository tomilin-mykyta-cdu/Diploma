import React from 'react';
import {GridColDef} from "@mui/x-data-grid";
import CustomList from "./List";
import {GET_ANIMAL_SPECIES, GET_FEED_RECEIPT} from "../../graphql/requests";

const FeedReceiptList: React.FC = () => {
    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Ідентифікатор', width: 160, sortable: false},
        {field: 'title', headerName: 'Тварина', width: 200, sortable: false},
    ];

    return <>
        <CustomList
            itemsPerPage={10}
            columns={columns}
            query={GET_FEED_RECEIPT}
            queryKey={'getFeedReceipts'}
            subscribeAddress={'feed-receipt/sse'}
        />
    </>

};

export default FeedReceiptList;