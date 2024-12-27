import React from 'react';
import {GridColDef} from "@mui/x-data-grid";
import CustomList from "./List";
import {GET_UKRAINE_REGION} from "../../graphql/requests";

const UkraineRegionList: React.FC = () => {
    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Ідентифікатор', width: 160, sortable: false},
        {field: 'title', headerName: 'Область', width: 200, sortable: false},
    ];

    return <>
        <CustomList
            itemsPerPage={10}
            columns={columns}
            query={GET_UKRAINE_REGION}
            queryKey={'getUkraineRegions'}
            subscribeAddress={'ukraine-region/sse'}
        />
    </>
};

export default UkraineRegionList;