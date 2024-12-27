import React, {useState} from 'react';
import BarChart from '../Chart/Bars';
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack} from '@mui/material';
import {Vocabulary, VocabularyDomains} from '../../vocabulary/data';
import {getDomainTranslate} from '../../vocabulary/translates';

type Props = {
    onGenerateChart: (component: any) => void;
    onRemoveChart: () => void;
    chartId: string;
};

const BarsChartForm: React.FC<Props> = (props) => {
    const [domain, setDomain] = useState<string>(VocabularyDomains[0]);
    const [filtersToPickFrom, setFiltersToPickFrom] = useState<string[]>(Object.keys(Vocabulary[domain].instances));

    const [xInstance, setXInstance] = useState<string>(filtersToPickFrom[0]);
    const [yInstance, setYInstance] = useState<string>(filtersToPickFrom[1]);

    const handleBarsTypeChange = (event: SelectChangeEvent) => {
        const domain = event.target.value
        setDomain(domain);
        const filters = Object.keys(Vocabulary[domain].instances);
        setFiltersToPickFrom(filters);
    }

    const handleXChange = (event: SelectChangeEvent) => {
        setXInstance(event.target.value);
    }

    const handleYChange = (event: SelectChangeEvent) => {
        setYInstance(event.target.value);
    }

    const generateChart = () => {
        props.onGenerateChart(
            <BarChart
                key={props.chartId}
                vocabulary={Vocabulary[domain]}
                xInstance={xInstance}
                yInstance={yInstance}
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
                    onChange={handleBarsTypeChange}
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
                    value={xInstance}
                    key={'pi-chart-form-filter-select'}
                    label="Фільтр"
                    onChange={handleXChange}>
                    {
                        filtersToPickFrom.filter(x => x != yInstance).map((x, i) => (
                            <MenuItem value={x} key={`pi-chart-form-filter-option-${i}`}>
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
                    value={yInstance}
                    key={'pi-chart-form-filter-select'}
                    label="Фільтр"
                    onChange={handleYChange}>
                    {
                        filtersToPickFrom.filter(x => x != xInstance).map((x, i) => (
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

export default BarsChartForm;
