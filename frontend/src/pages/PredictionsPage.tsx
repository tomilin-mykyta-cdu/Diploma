import React from 'react';
import PredictionsChart from "../components/Chart/Predictions";
import {VocabularyPredictions} from "../vocabulary/predictions";
import Grid from "@mui/material/Grid2";

const PredictionsPage: React.FC = () => {
    const [charts, setCharts] = React.useState([]);
    return (
        <>
            <Grid spacing={3}>
                <PredictionsChart
                    entity={VocabularyPredictions['MarketDemand'].instances[0]}
                    vocabulary={VocabularyPredictions['MarketDemand']}
                    onRemoveChart={() => {
                    }}
                />
            </Grid>
            <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                {charts.map(chart => <Grid size={6} key={chart['key'] + '-grid'}>{chart}</Grid>)}
            </Grid>
            <Grid spacing={3}>
                {/*<NewPredictionComponent*/}
                {/*    onGenerateChart={addChart}*/}
                {/*    onRemoveChart={() => removeChart(newId)}*/}
                {/*    chartId={newId}*/}
                {/*/>*/}
            </Grid>

        </>
    )
};

export default PredictionsPage;
