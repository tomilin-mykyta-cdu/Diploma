import React from 'react';
import {GridColDef} from "@mui/x-data-grid";
import CustomList from "./List";
import {GET_MARKET_DEMAND_DATA} from "../../graphql/requests";

const MarketDemandList: React.FC = () => {
    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Ідентифікатор', width: 160, sortable: false},
        {field: 'title', headerName: 'Назва корму', width: 200, sortable: false},
        {field: 'ukraineRegion', headerName: 'Область', width: 200, sortable: false},
        {field: 'animalSpecies', headerName: 'Тваринка', width: 200, sortable: false},
        {field: 'feedSegment', headerName: 'Сегмент', width: 200, sortable: false},
    ];

    return <>
        <CustomList
            itemsPerPage={20}
            columns={columns}
            query={GET_MARKET_DEMAND_DATA}
            queryKey={'getMarketDemands'}
            parser={(x: any) => ({
                id: x.id,
                title: x.production[0].feed[0].feedTitle[0].title,
                animalSpecies: x.production[0].feed[0].animalSpecies[0].title,
                ukraineRegion: x.ukraineRegion[0].title,
                feedSegment: x.production[0].feed[0].feedSegment[0].title,
            })}
            parserSingle={(x: any) => ({
                id: x.id,
                title: x.production.feed.feedTitle.title,
                animalSpecies: x.production.feed.animalSpecies.title,
                ukraineRegion: x.ukraineRegion.title,
                feedSegment: x.production.feed.feedSegment.title,
            })}
            subscribeAddress={'market-demand/sse'}
        />
    </>
};

export default MarketDemandList;