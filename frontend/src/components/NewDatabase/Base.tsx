import React from "react";
import {
    DynamicFormInput,
    NewFormInput,
    NewFormStructure
} from "../../vocabulary/databaseData";
import {Box, Button, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import {useMutation} from "@apollo/client";
import useMultipleQueries from "../../hooks/useMultipleQueries";
import { extractArrayFromObjectIDontCare } from '../../utils/object.utils';

type Props = {
    vocabulary: NewFormStructure;
    handleClose: () => void;
}

const NewDatabaseAbstract: React.FC<Props> = (props: Props) => {
    const {vocabulary} = props;
    const inputs = vocabulary.inputs;

    const [fields, setFields] = React.useState(
        inputs.reduce(
            (acc: Record<string, any>, input: NewFormInput) => {
                acc[input.key] = undefined;
                return acc;
            },
            {} as Record<string, any>,
        )
    );

    const updateField = (key: string, value: string) => {
        setFields(prev => ({...prev, [key]: value} as Record<string, any>));
    }

    const [delayedMutationCall] = useMutation(vocabulary.request, {
        onCompleted: () => {
            props.handleClose();
        },
        onError: (error) => {
            console.error('NewDatabaseAbstract:', error);
        },
    });

    const dynamicInputs = inputs
        .filter((x): x is DynamicFormInput => x.type === 'select');

    const multipleQueriesResults = dynamicInputs
        .map(x => x.from)
        .map(useMultipleQueries);

    if (multipleQueriesResults.length && multipleQueriesResults.some((response) => response.loading)) {
        return <>Loading</>
    }

    const handleCreate = () => {
        const parsedFields = Object.keys(fields).reduce((acc: any, key: any) => {
            if (key === 'price') {
                acc[key] = parseInt(fields[key]);
            } else {
                acc[key] = fields[key];
            }
            return acc;
        }, {});
        delayedMutationCall({variables: parsedFields});
    };

    const handleCancel = () => {
        props.handleClose();
    };

    const buttonDisabled = !Object.values(fields).every(Boolean);

    return <>
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '300px',
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 3,
            }}
        >
            {
                inputs.map((input) => {
                    if (input.type === 'string') {
                        return <TextField
                            label={input.label}
                            variant="outlined"
                            value={fields[input.key]}
                            onChange={(e) => updateField(input.key, e.target.value)}
                            fullWidth
                        />
                    } else {
                        const dynamicInputIndex = dynamicInputs.findIndex((di: DynamicFormInput) => di.key === input.key)
                        const queryData = multipleQueriesResults[dynamicInputIndex].data;

                        // console.log(queryData[input.fromKey])

                        const getValue = (x: any) => {
                            if (!x) {
                                return '-'
                            }

                            if (input.accessField) {
                                return extractArrayFromObjectIDontCare(x, input.accessField)[0];
                            } else if (x.title) {
                                return x.title
                            } else {
                                return '-';
                            }
                        }

                        return <>
                        <InputLabel id="demo-simple-select-label">{input.label}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={fields[input.key]}
                            label={input.label}
                            onChange={ev => updateField(input.key, ev.target.value as any)}
                        >
                            {
                                [...queryData[input.fromKey], undefined].map((x: any) => {
                                    return <MenuItem value={x?.id ?? x}>{getValue(x)}</MenuItem>
                                })
                            }
                        </Select>
                        </>
                    }
                })
            }

            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={handleCreate} disabled={buttonDisabled}>
                    Створити
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                    Відміна
                </Button>
            </Stack>
        </Box>
    </>
}

export default NewDatabaseAbstract;
