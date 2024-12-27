// https://mui.com/x/react-charts/pie/
import React, {useEffect, useState} from 'react';

import { BarChart as MuiBarChart } from '@mui/x-charts';
import {Domain} from '../../../vocabulary/data';
import { useQuery } from '@apollo/client';
import { extractArrayFromObjectIDontCare } from '../../../utils/object.utils';
import ChartFilters from '../ChartFilters';
import {Button} from "@mui/material";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {useChartData} from "../../../utils/context";
import useSSE from "../../../hooks/useSSE";

type Props = {
    vocabulary: Domain;
    onRemoveChart: () => void;

    xInstance: string;
    yInstance: string;
}

const chartSetting = {
    yAxis: [
        {
            label: 'Реалізований товар (одиниці)',
        },
    ],
    width: 500,
    height: 300,
};

const BarChart: React.FC<Props> = React.memo((props: Props) => {
    const { animalSpecies, feedSegments, ukraineRegions, feedTitles } = useChartData().sharedProps;

    const vocabularyData = props.vocabulary;
    const variables = vocabularyData.variables!;

    const [fetchedData, setFetchedData] = useState<any>(undefined);
    const [pickedFilterNames, setPickedFilterNames] = useState<string[]>([]);
    const [dynamicFilters, setDynamicFilters] = useState(
        variables.reduce(
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

    const { loading, error, data } = useQuery(vocabularyData.request, {
        fetchPolicy: 'no-cache',
        variables: { filter: dynamicFilters },
    });

    useEffect(() => {
        if (data) {
            setFetchedData(data[vocabularyData.responseKey].sort((b: any, a: any) => b.id - a.id));
        }
    }, [data, vocabularyData.responseKey]);

    useSSE(`http://localhost:3001/${vocabularyData.subscribeAddress!}`, vocabularyData.responseKey, (data) => {
        setFetchedData((prev: any) => {
            return [
                data,
                ...prev,
            ].sort((b: any, a: any) => b.id - a.id);
        });
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;
    if (!fetchedData) return <p>Loading (no data)...</p>;

    const keyX = vocabularyData.instances[props.xInstance].key;
    const keyY = vocabularyData.instances[props.yInstance].key;

    function parse(array: Record<string, any>[], paths: string[]) {
        return paths.map((path) => {
            return extractArrayFromObjectIDontCare(
                array,
                path,
            )
        })
    }

    const [xParsedEntities, yParsedEntities] = parse(fetchedData, [keyX, keyY]);

    const xMap = Array
            .from(new Set(xParsedEntities.map(x => x.title)))
            .reduce((acc, x) => {
                acc[x] = {};
                return acc;
                },
                {},
            );

    const yParsedTitles = Array.from(new Set(yParsedEntities.map(x => x.title)));

    Object.keys(xMap).forEach((xTitle) => {
        yParsedTitles.forEach((yTitle) => {
            xMap[xTitle][yTitle] = 0;
        })
    })

    yParsedEntities.forEach((x, yIndex) => {
        const key1 = xParsedEntities[yIndex].title;
        xMap[key1][x.title] += 1;
    })

    const dataset = Object.keys(xMap)
        .map((xTitle) => {
        const datasetRow: any = {
            filter: xTitle,
        };
        Object.keys(xMap[xTitle]).forEach(yTitle => {
            datasetRow[yTitle] = xMap[xTitle][yTitle];
        })
        return datasetRow;
    });

    const series = yParsedTitles.map((object) => ({ dataKey: object, label: object}));

    const id = generateUniqueID()
    return <>
        <MuiBarChart
            key={id}
            dataset={dataset}
            xAxis={[{ scaleType: 'band', dataKey: 'filter' }]}
            // slotProps={{ legend: { hidden: true } }}
            barLabel="value"
            series={
                series
        }
            {...chartSetting}
        />
        <ChartFilters
            variables={variables}
            setDynamicFilters={(value) => setDynamicFilters(value)}
            dynamicFilters={dynamicFilters}
            pickedFilterNames={pickedFilterNames}
            prefetchedFilterValues={prefetchedFilterValues}
            setPickedFilterNames={setPickedFilterNames}
            key={`bars-filters-${JSON.stringify(dynamicFilters)}`}
        />
        <Button onClick={props.onRemoveChart}>REMOVE CHART</Button>
    </>
});

// @ts-ignore
export default BarChart;
