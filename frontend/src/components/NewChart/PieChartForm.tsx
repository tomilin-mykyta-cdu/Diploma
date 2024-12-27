import React, {useState} from "react";
import {Vocabulary, VocabularyDomains} from "../../vocabulary/data";
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack} from "@mui/material";
import PieChart from "../Chart/Pie";
import {getDomainTranslate} from "../../vocabulary/translates";

type Props = {
    onGenerateChart: (component: any) => void;
    onRemoveChart: () => void;
    chartId: string;
};

const PieChartForm: React.FC<Props> = (props) => {
    const [domain, setDomain] = useState<string>(VocabularyDomains[0]);
    const [filtersToPickFrom, setFiltersToPickFrom] = useState<string[]>(Object.keys(Vocabulary[domain].instances));
    const [filter, setFilter] = useState<string>(filtersToPickFrom[0]);

    const handlePieTypeChange = (event: SelectChangeEvent) => {
        const domain = event.target.value
        setDomain(domain);
        const filters = Object.keys(Vocabulary[domain].instances);
        setFiltersToPickFrom(filters);
        setFilter(filters[0]);
    }

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value);
    }

    const generateChart = () => {
        props.onGenerateChart(
            <PieChart
                entity={filter}
                key={props.chartId}
                vocabulary={Vocabulary[domain]}
                onRemoveChart={props.onRemoveChart}
            />
        );
    }

    return <>
        <Stack spacing={2}>
            <FormControl fullWidth={true}>
                <InputLabel id="pie-type-label" key={'pi-chart-form-type-input'}>Сутність</InputLabel>
                <Select
                    labelId="pie-type-label"
                    id="pie-type-select"
                    value={domain}
                    key={'pi-chart-form-type-select'}
                    label="Сутність"
                    onChange={handlePieTypeChange}
                >
                    {
                        VocabularyDomains.map((x, i) => (
                            <MenuItem value={x} key={`pi-chart-form-type-option-${i}`}>
                                {getDomainTranslate(x)}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <FormControl fullWidth={true}>
                <InputLabel id="filter-label" key={'pi-chart-form-filter-input'}>Фільтр</InputLabel>
                <Select
                    labelId="filter-label"
                    id="filter-select"
                    value={filter}
                    key={'pi-chart-form-filter-select'}
                    label="Фільтр"
                    onChange={handleFilterChange}>
                    {
                        filtersToPickFrom.map((x, i) => (
                            <MenuItem value={x} key={`pi-chart-form-filter-option-${i}`}>
                                {getDomainTranslate(x)}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            <Button variant="contained" onClick={generateChart}>Додати</Button>


        </Stack>
    </>
}

export default PieChartForm;
