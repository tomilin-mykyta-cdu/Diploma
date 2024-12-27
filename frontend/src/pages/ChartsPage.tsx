import React, {useEffect} from 'react';
import NewChartComponent from "../components/NewChart";
import Grid from '@mui/material/Grid2';
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {useChartData} from "../utils/context";

// const ChartDataContext = createContext<any>(null);
// export const useChartData = () => useContext(ChartDataContext);

const ChartsPage: React.FC = () => {
    const [charts, setCharts] = React.useState([]);

    const addChart = (chart: any) => {
        setCharts(charts.concat(chart));
    }

    const removeChart = (chartKey: string) => {
        setCharts(prevState => prevState.filter(chart => {
            return chart['key'] !== chartKey;
        }));
    }

    const newId = generateUniqueID();
    const { sharedProps } = useChartData();
    useEffect(() => {
        setCharts((prevCharts: any) => {
            return prevCharts.map((chart: any) =>
                React.cloneElement(chart, sharedProps)
            );
        });
    }, [sharedProps]);

    return (
        <>
            <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}} key={'grid_for_charts_with_data_context'}>
                    {
                        charts.map((chart) => {
                            return <Grid size={6} key={(chart as any).key + '-grid-'}>
                                { chart }
                            </Grid>
                       })
                    }
            </Grid>
            <Grid container spacing={3}>
                <Grid size="grow">
                </Grid>
                <Grid size={6} marginTop={8}>
                    <NewChartComponent
                        chartId={newId}
                        key={'new-chart-component'}
                        onGenerateChart={addChart}
                        onRemoveChart={() => removeChart(newId)}
                    />
                </Grid>
                <Grid size="grow">
                </Grid>
            </Grid>
        </>
    )
};

export default ChartsPage;
