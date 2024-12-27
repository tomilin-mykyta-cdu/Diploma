import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import React from "react";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {Dayjs} from "dayjs";

type Props = {
    value: Dayjs;
    label: string;
    onChange: (ev: Dayjs | null, key: string) => void;
    stateKey: string;
}

export const SelectDate = (props: Props) => {
    const { value, label, onChange, stateKey } = props;
    return <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker
                    label={label}
                    value={value}
                    onChange={val => {
                        onChange(val, stateKey)
                    }}
                />
            </DemoContainer>
        </LocalizationProvider>
    </>
}