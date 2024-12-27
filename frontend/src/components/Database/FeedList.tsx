import React from 'react';
import {GridColDef} from "@mui/x-data-grid";
import {GET_FEED} from "../../graphql/requests";
import CustomList from "./List";

const FeedList: React.FC = () => {
    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Ідентифікатор', width: 160, sortable: false},
        {field: 'title', headerName: 'Назва корму', width: 200, sortable: false},
        {field: 'animalSpecies', headerName: 'Тварина', width: 200, sortable: false},
        {field: 'feedSegment', headerName: 'Сегмент', width: 200, sortable: false},
    ];

    return <>
        <CustomList
            itemsPerPage={20}
            columns={columns}
            query={GET_FEED}
            queryKey={'getFeed'}
            parser={(x: any) => ({
                id: x.id,
                title: x.feedTitle.title,
                animalSpecies: x.animalSpecies.title,
                feedSegment: x.feedSegment.title,
            })}
            parserSingle={(x: any) => ({
                id: x.id,
                title: x.feedTitle.title,
                animalSpecies: x.animalSpecies.title,
                feedSegment: x.feedSegment.title,
            })}
            subscribeAddress={'feed/sse'}
        />
    </>
};

export default FeedList;
