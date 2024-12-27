import React, {useState} from 'react';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack} from "@mui/material";
import {ValueOf} from "../../utils/types";
import PieChartForm from "./PieChartForm";
import {CHART_TYPE} from '../Chart/types';
import BarsChartForm from "./BarsChartForm";

type Props = {
    onGenerateChart: (component: any) => void;
    onRemoveChart: () => void;
    chartId: string;
}

const NewChartComponent: React.FC<Props> = (props: Props) => {
    const {onGenerateChart, onRemoveChart, chartId } = props;

    const [chartType, setChartType] = useState<ValueOf<typeof CHART_TYPE>>(CHART_TYPE.PIE);

    const handleChartTypeChange = (event: SelectChangeEvent) => {
        setChartType(event.target.value as ValueOf<typeof CHART_TYPE>);
    };

    return (
        <>
            <Stack spacing={2}>
                <FormControl fullWidth={true}>
                    <InputLabel id="select-chaty-type-label">Виберіть графік</InputLabel>
                    <Select
                        labelId="select-chaty-type-label"
                        id="chart-type-id"
                        value={chartType}
                        label="Виберіть графік"
                        onChange={handleChartTypeChange}
                    >
                        <MenuItem key={`new-chart-pie`} value={CHART_TYPE.PIE}>Секторна діаграма</MenuItem>
                        <MenuItem key={`new-chart-bars`} value={CHART_TYPE.BARS}>Стовпчикова діаграма</MenuItem>
                    </Select>
                </FormControl>

                {chartType === CHART_TYPE.PIE &&
                    <PieChartForm key={'new-pie-chart-form'} onGenerateChart={onGenerateChart}
                                  onRemoveChart={onRemoveChart} chartId={chartId}
                    />}
                {chartType === CHART_TYPE.BARS &&
                    <BarsChartForm key={'new-bars-chart-form'} onGenerateChart={onGenerateChart}
                                   onRemoveChart={onRemoveChart} chartId={chartId}/>}
            </Stack>
        </>
    )
};

export default NewChartComponent;
