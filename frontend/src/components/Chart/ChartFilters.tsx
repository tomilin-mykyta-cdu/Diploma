import React from 'react';
import {Variable, VariableDate, VariableQuery} from '../../vocabulary/data';
import {Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select} from '@mui/material';
import SelectField from './Pie/SelectField';
import {FinalVariable, VariableQueryWithData} from './Pie';
import {QueryResult} from '@apollo/client';
import Grid from "@mui/material/Grid2";

type Props = {
    variables: Variable[];
    multipleQueriesResults?: QueryResult[];

    setDynamicFilters: (value: any) => void;
    dynamicFilters: any;

    pickedFilterNames: string[];
    setPickedFilterNames: (value: any) => void;

    prefetchedFilterValues?: any;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const ChartFilters = (props: Props) => {
    const {
        variables,
        dynamicFilters, setDynamicFilters,
        pickedFilterNames, setPickedFilterNames,
    } = props;

    // console.log(variables, multipleQueriesResults, dynamicFilters, pickedFilterNames);

    const includedVariables = variables.filter((x: Variable) => pickedFilterNames.includes(x.label));

    const updateDynamicFilters = (value: any, variableKey: string) => {
        let newValue: any;
        if (variables.find(x => x.key === variableKey)!.type === 'date') {
            newValue = value;
        } else {
            newValue = typeof value === 'string' ? value.split(',') : value
        }

        setDynamicFilters({
            ...dynamicFilters,
            [variableKey]: newValue
        })
    };

    const updatePickedFilters = (event: any) => {
        const value = event.target.value;

        const disabledVariables = variables.filter(x => !value.includes(x.label))
            // .map(x => x.key)
            .reduce((acc, x) => {
                acc[x.key] = x.type === 'date' ? null : [];
                return acc;
            }, {} as any);

        setDynamicFilters({
            ...dynamicFilters,
            ...disabledVariables
        });

        setPickedFilterNames(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const queryFilters: VariableQueryWithData[] = variables
        .filter((x: Variable): x is VariableQuery => (
            x.type !== 'date'
        ))
        .map((x, index) => {
            // console.log(x);
            return ({
                ...x,
                data: props.prefetchedFilterValues[x.key]
            })
        })
        .filter(x => {
            return pickedFilterNames.includes(x.label);
        }); // update all but take only picked

    const filters: FinalVariable[] = includedVariables.filter(
        (x: Variable): x is VariableDate => x.type === 'date').concat(queryFilters as any);

    return (<>
        <Grid>
            <FormControl sx={{m: 1, minWidth: 300}}>
                <InputLabel id="demo-multiple-checkbox-label">Фільтри</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={pickedFilterNames}
                    onChange={updatePickedFilters}
                    input={<OutlinedInput label="Tag"/>}
                    MenuProps={MenuProps}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {variables.map((x) => x.label)
                        .map((name) => (
                            <MenuItem key={`picker-${name}`} value={name}>
                                <Checkbox key={`checkbox-${name}`} checked={pickedFilterNames.includes(name)}/>
                                <ListItemText key={`list-item-${name}`} primary={name}/>
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </Grid>
        <Grid>
            {
                filters.map((filter) => {
                        if (filter.type === 'date') {
                            return (
                                <FormControl sx={{m: 1, minWidth: 300}}>
                                    {/*<InputLabel*/}
                                    {/*    id={`demo-multiple-checkbox-label-${filter.label}`}>{filter.label}</InputLabel>*/}
                                    <SelectField
                                        filter={filter}
                                        value={dynamicFilters[filter.key]}
                                        key={`dynamic-filter-${filter.key}`}
                                        onChange={value => updateDynamicFilters(value, filter.key)}
                                    />
                                </FormControl>
                            )
                        } else {
                            return (
                                <FormControl sx={{m: 1, minWidth: 300}}>
                                    <InputLabel
                                        id={`demo-multiple-checkbox-label-${filter.label}`}>{filter.label}</InputLabel>
                                    <Select
                                        labelId="filter-multiple-checkox"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        value={dynamicFilters[filter.key]}
                                        onChange={(ev) => updateDynamicFilters(ev.target.value, filter.key)}
                                        input={<OutlinedInput label="Tag"/>}
                                        MenuProps={MenuProps}
                                        renderValue={(selected) => selected.join(', ')}
                                    >
                                        {queryFilters.filter((x) => x.key === filter.key)
                                            .map(subf => {
                                                return subf.data.map((x: any) => x)
                                            })
                                            .map((names: string[]) => {
                                                return names.map(name => <MenuItem key={`picker-${name}`} value={name}>
                                                    <Checkbox key={`checkbox-${name}`}
                                                              checked={dynamicFilters[filter.key].includes(name)}/>
                                                    <ListItemText key={`list-item-${name}`} primary={name}/>
                                                </MenuItem>)
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            )
                        }
                    }
                )
            }
        </Grid>
    </>)
}

export default ChartFilters;
