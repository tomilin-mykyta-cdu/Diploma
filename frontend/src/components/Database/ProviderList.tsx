import React from 'react';
import {GridColDef} from "@mui/x-data-grid";
import CustomList from "./List";
import {GET_PROVIDER} from "../../graphql/requests";

const ProviderList: React.FC = () => {
    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Ідентифікатор', width: 160, sortable: false},
        {field: 'title', headerName: 'Постачальник', width: 200, sortable: false},
    ];

    return <>
        <CustomList
            itemsPerPage={10}
            columns={columns}
            query={GET_PROVIDER}
            queryKey={'getProviders'}
            subscribeAddress={'provider/sse'}
        />
    </>
};

export default ProviderList;