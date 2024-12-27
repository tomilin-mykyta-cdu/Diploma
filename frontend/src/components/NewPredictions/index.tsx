import React, {useState} from 'react';
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack,} from "@mui/material";
import {VocabularyPredictions} from "../../vocabulary/predictions";
import PredictionsByParameter from "../Analitics/PredictionsByParameter";

type Props = {
    onGenerateChart: (component: any) => void;
    onRemoveChart: () => void;
    chartId: string;
}

const NewPredictionComponent: React.FC<Props> = ({onGenerateChart, onRemoveChart, chartId}: Props) => {
    const domain = VocabularyPredictions['MarketDemand'];
    const [filter, setFilter] = useState();

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value as any);
    };

    const generate = () => {
        onGenerateChart(<PredictionsByParameter domain={domain} filter={filter} />);
    }

    const variables = (domain.variables ?? []).filter(x => x.type !== 'date');

    return (
        <>
            <Stack spacing={2}>
                <FormControl fullWidth={true}>
                    <InputLabel id="select-prediction-input">Виберіть фільтр</InputLabel>
                    <Select
                        labelId="select-prediction-input"
                        id="new-select-prediction-input"
                        value={filter}
                        label="Виберіть фільтр"
                        onChange={handleFilterChange}
                    >
                        {
                            variables.map(variable => (
                                <MenuItem key={`new-prediction-chart-select-${variable.key}`} value={variable.key}>{variable.label}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <Button onClick={generate}>create</Button>
            </Stack>
        </>
    )
};

export default NewPredictionComponent;
