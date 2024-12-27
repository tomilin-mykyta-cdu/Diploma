import React from "react";
import {FinalVariable} from "./index";
import {SelectFilter} from "./SelectFilter";
import {SelectDate} from "./SelectDate";
import {Dayjs} from "dayjs";
import {InputLabel} from "@mui/material";

type Props = {
    filter: FinalVariable;
    value: string | Dayjs | null;
    onChange: (ev: Dayjs | null | string, key: string) => void;
}

export const SelectField = (props: Props) => {
    const { filter, value, onChange } = props;
    if (filter.type === 'string') {
        return <>
            <InputLabel
                id={`demo-multiple-checkbox-label-${filter.label}`}>{filter.label}</InputLabel>
            <SelectFilter
                key={`select-${filter.label}`}
                value={value as string}
                label={filter.label}
                onChange={str => onChange(str, filter.key)}
                stateKey={filter.key}
                filter={filter}
            />
        </>
    } else if (filter.type === 'date') {
        return <>
            <SelectDate
                value={value as Dayjs}
                label={filter.label}
                onChange={value => onChange(value, filter.key)}
                stateKey={filter.key}
            />
        </>
    } else {
        return <></>
    }

}

export default SelectField;