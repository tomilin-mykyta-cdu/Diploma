import React from 'react';
import {GET_ANIMAL_SPECIES} from "../../graphql/requests";
import {GridColDef} from '@mui/x-data-grid';
import CustomList from "./List";

const AnimalSpeciesList: React.FC = () => {
    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Ідентифікатор', width: 160, sortable: false},
        {field: 'title', headerName: 'Тварина', width: 200, sortable: false},
    ];
    return <>
        <CustomList itemsPerPage={15} columns={columns} query={GET_ANIMAL_SPECIES}
            queryKey={'getAnimalSpecies'} subscribeAddress={'animal-species/sse'}/>
    </>
};

export default AnimalSpeciesList;