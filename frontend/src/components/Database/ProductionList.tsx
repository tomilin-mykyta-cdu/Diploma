import React from 'react';
import {GridColDef} from "@mui/x-data-grid";
import CustomList from "./List";
import {GET_PRODUCTIONS} from "../../graphql/requests";

const ProductionList: React.FC = () => {
    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Ідентифікатор', width: 160, sortable: false},
        {field: 'title', headerName: 'Назва корму', width: 200, sortable: false},
        {field: 'animalSpecies', headerName: 'Тваринка', width: 200, sortable: false},
        {field: 'feedSegment', headerName: 'Сегмент', width: 200, sortable: false},
        // {field: 'amount', headerName: 'Вироблено', width: 200, sortable: false},
    ];

    return <>
        <CustomList
            itemsPerPage={20}
            columns={columns}
            query={GET_PRODUCTIONS}
            queryKey={'getProductions'}
            parser={(x: any) => {
                return ({
                    id: x.id,
                    title: x.feed[0].feedTitle[0].title,
                    animalSpecies: x.feed[0].animalSpecies[0].title,
                    feedSegment: x.feed[0].feedSegment[0].title,
                    amount: x.amount,
                });
            }}

            parserSingle={(x: any) => ({
                id: x.id,
                title: x.feed.feedTitle.title,
                animalSpecies: x.feed.animalSpecies.title,
                feedSegment: x.feed.feedSegment.title,
                amount: x.amount,
            })}
            subscribeAddress={'production/sse'}
        />
    </>
};

export default ProductionList;
