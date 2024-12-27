import React from 'react';
import {GridColDef} from "@mui/x-data-grid";
import CustomList from "./List";
import {GET_INGREDIENT} from "../../graphql/requests";

const IngredientList: React.FC = () => {
    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Ідентифікатор', width: 160, sortable: false},
        {field: 'title', headerName: 'Інгредієнт', width: 200, sortable: false},
    ];

    return <>
        <CustomList
            itemsPerPage={10}
            columns={columns}
            query={GET_INGREDIENT}
            queryKey={'getIngredients'}
            subscribeAddress={'ingredient/sse'}
        />
    </>
};

export default IngredientList;