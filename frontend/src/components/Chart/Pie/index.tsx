// https://mui.com/x/react-charts/pie/
import React, {useEffect, useState} from "react";
import {
    Domain,
    VariableDate,
    VariableQuery,
} from "../../../vocabulary/data";
import {useQuery} from '@apollo/client';
import {buildPieChartData, extractArrayFromObjectIDontCare} from "../../../utils/object.utils";
import {PieChart as MuiPieChart} from '@mui/x-charts';
import ChartFilters from '../ChartFilters';
import {Button, Stack} from "@mui/material";
import Grid from "@mui/material/Grid2";
import useSSE from '../../../hooks/useSSE';
import {useChartData} from "../../../utils/context";

type Props = {
    entity: any;
    vocabulary: Domain;

    onRemoveChart: () => void;
}

export type VariableQueryWithData = VariableQuery & { data: any };
export type FinalVariable = VariableQueryWithData | VariableDate;

const PieChart: React.FC<Props> = React.memo((props: Props) => {
    const { animalSpecies, feedSegments, ukraineRegions, feedTitles } = useChartData().sharedProps;

    const vocabularyData = props.vocabulary;
    const entity = vocabularyData.instances[props.entity];

    const variables = vocabularyData.variables!;

    const [fetchedData, setFetchedData] = useState<any>(undefined);
    const [pickedFilterNames, setPickedFilterNames] = useState<string[]>([]);

    const [dynamicFilters, setDynamicFilters] = useState(
        variables?.reduce(
            (acc, variable) => {
                acc[variable.key] = variable.type === 'date' ? null : [];
                return acc;
            },
            {} as any,
        )
    );
    const [prefetchedFilterValues, setPrefetchedFilterValues] = useState(
        variables?.filter(x => x.type !== 'date').reduce(
            (acc, variable) => {
                acc[variable.key] = [];
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

    const {loading, error, data} = useQuery(vocabularyData.request, {
        fetchPolicy: 'no-cache',
        variables: {filter: dynamicFilters},
    });

    useEffect(() => {
        if (data) {
            setFetchedData(data[vocabularyData.responseKey].sort((a: any, b: any) => b.id - a.id).map((item: any, i: number) => ({
                ...item,
                key: `value-${i}`
            })));
        }
    }, [data, vocabularyData.responseKey]);

    useSSE(`http://localhost:3001/${vocabularyData.subscribeAddress!}`, vocabularyData.responseKey, (data) => {
        setFetchedData((prev: any) => (Array.isArray(prev) ? [data, ...prev] : [data]).sort((a: any, b: any) => b.id - a.id).map((item: any, i: number) => ({
            ...item,
            key: `value-${i}`
        })));
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;
    if (!fetchedData) return <p>Loading (no data)...</p>;

    const response = extractArrayFromObjectIDontCare(
        fetchedData,
        entity.key,
    );

    const chartData = buildPieChartData(
        response,
        entity.parserKey,
        entity.parser,
    );

    return <>
        <Stack spacing={2}>
            <MuiPieChart
                title={entity.label}
                series={[{data: chartData}]}
                width={500}
                height={200}
                key={`${props.entity}-${JSON.stringify(vocabularyData)}`}
                legend={{
                    position: {horizontal: 'right', vertical: 'middle'}
                }}
            />
            <Grid>
                <ChartFilters
                    variables={variables}
                    setDynamicFilters={(value) => setDynamicFilters(value)}
                    dynamicFilters={dynamicFilters}
                    pickedFilterNames={pickedFilterNames}
                    setPickedFilterNames={setPickedFilterNames}
                    prefetchedFilterValues={prefetchedFilterValues}
                    key={`chart-filters-${props.entity}-${JSON.stringify(dynamicFilters)}`}
                />
                <Button variant={'contained'} onClick={props.onRemoveChart}>REMOVE CHART</Button>
            </Grid>
        </Stack>
    </>
});

export default PieChart;
