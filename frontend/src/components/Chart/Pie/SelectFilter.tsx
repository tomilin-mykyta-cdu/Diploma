import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import React from "react";
import {VariableQueryWithData} from "./index";

type Props = {
    value: string;
    label: string;
    onChange: (ev: string, key: string) => void;
    stateKey: string;
    filter: VariableQueryWithData;
}

export const SelectFilter = (props: Props) => {
    const { value, label, onChange, stateKey, filter } = props;
    return <>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label={label}
                onChange={ev => onChange(ev.target.value as any, stateKey)}
            >
                { filter.data.map((x: any) => {
                    return <MenuItem value={x ? x[filter.fieldKey!] : x}>{x ? x[filter.fieldKey!] : '-'}</MenuItem>
                }) }
            </Select>
        </FormControl>
    </>
}