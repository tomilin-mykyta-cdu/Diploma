import React, {useEffect, useState} from "react";
import {Domain} from "../../../vocabulary/predictions";
import {useQuery} from "@apollo/client";
import {GET_MARKET_DEMAND_FORECAST_AMOUNT_DATA} from "../../../graphql/requests/predictions";
import ChartFilters from "../../Chart/ChartFilters";
import {Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PredictionsByMonthsComponent from "./PredictonsByMonths";
import PredictionsByWeeksComponent from "./PredictonsByWeeks";
import {useChartData} from "../../../utils/context";
import useSSE from "../../../hooks/useSSE";


type Props = {
    entity: any;
    vocabulary: Domain;
}

export const OverallSalesPredictions: React.FC<Props> = (props) => {
    const vocabularyData = props.vocabulary;
    const variables = vocabularyData.variables!;
    const [fetchedData, setFetchedData] = useState<any>([]);
    const { animalSpecies, feedSegments, ukraineRegions, feedTitles } = useChartData().sharedProps;

    const [prefetchedFilterValues, setPrefetchedFilterValues] = useState(
        variables?.filter(x => x.type !== 'date').reduce(
            (acc, variable) => {
                acc[variable.key] = [];
                return acc;
            },
            {} as any,
        )
    );

    const [pickedFilterNames, setPickedFilterNames] = useState<string[]>([]);
    const [dynamicFilters, setDynamicFilters] = useState(
        variables?.reduce(
            (acc, variable) => {
                if (variable.type === 'date') {
                    acc[variable.key] = variable.default ?? null;
                } else {
                    acc[variable.key] = [];
                }
                return acc;
            },
            {} as any,
        )
    );

    useEffect(() => {
        setPrefetchedFilterValues((prev: any) => {
            return {
                ...prev,
                animalSpeciesTitle: animalSpecies?.map((x: any) => x.title) || [],
                feedSegmentTitle: feedSegments?.map((x: any) => x.title) || [],
                ukraineRegionTitle: ukraineRegions?.map((x: any) => x.title) || [],
                feedTitle: feedTitles?.map((x: any) => x.title) || [],
            }
        });
    }, [
        animalSpecies,
        feedSegments,
        ukraineRegions,
        feedTitles,
    ]);

    const {
        loading: predictions_loading,
        error: predictions_error,
        data: predictions_data,
        refetch,
    } = useQuery(GET_MARKET_DEMAND_FORECAST_AMOUNT_DATA, {
        fetchPolicy: 'no-cache',
        variables: {
            filter: {
                ...dynamicFilters,
                period: 'weekly'
            },
        },
    });

    useEffect(() => {
        if (predictions_data) {
            setFetchedData(() => predictions_data['getMarketDemandsForecastAmount']?.['records'] ?? []);
        }
    }, [predictions_data]);

    useSSE(`http://localhost:3001/market-demand/getPredictions/sse`, 'getPredictions', (sseData) => {
        refetch({
            filter: {
                ...dynamicFilters,
                period: 'weekly',
            },
        }).then((refetched) => {
            setFetchedData(() => (refetched as any).data['getMarketDemandsForecastAmount']?.['records'] ?? []);
        })
    });


    if (predictions_loading) return <p>Loading...</p>;
    if (predictions_error) return <p>Error</p>;
    if (!predictions_data) return <p>No data</p>;

    return <>
        <Typography variant="h4" component="div">
            Прогнозування продажів
        </Typography>
        {
            fetchedData.length ?
                <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                    <Grid spacing={3}>
                        <PredictionsByMonthsComponent predictionsData={fetchedData} key={'123'}/>
                    </Grid>
                    <Grid spacing={3}>
                        <PredictionsByWeeksComponent predictionsData={fetchedData} key={'234'} width={1000}/>
                    </Grid>
                    <ChartFilters
                        variables={variables}
                        setDynamicFilters={(value) => setDynamicFilters(value)}
                        dynamicFilters={dynamicFilters}
                        pickedFilterNames={pickedFilterNames}
                        setPickedFilterNames={setPickedFilterNames}
                        prefetchedFilterValues={prefetchedFilterValues}
                        key={`chart-filters-${props.entity}-${JSON.stringify(dynamicFilters)}`}
                    />
                </Grid>
                :
                <></>
        }
    </>
}

export default OverallSalesPredictions;