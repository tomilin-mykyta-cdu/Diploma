import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DocumentNode, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Paper } from '@mui/material';
import useSSE from '../../hooks/useSSE';

type Props = {
    columns: GridColDef[];
    query: DocumentNode;
    queryKey: string;
    itemsPerPage: number;
    parser?: (x: any) => any;
    parserSingle?: (x: any) => any;
    subscribeAddress: string;
}

const CustomList: React.FC<Props> = (props: Props) => {
    const paginationModel = { page: 0, pageSize: props.itemsPerPage };
    const { loading, error, data } = useQuery(props.query, { fetchPolicy: 'no-cache' });

    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            const initialRows = props.parser
                ? data[props.queryKey].map(props.parser)
                : data[props.queryKey];
            setRows(initialRows);
        }
    }, [data]);

    useSSE(`http://localhost:3001/${ props.subscribeAddress! }`, props.queryKey, (incoming) => {
        setRows((prevRows) => [incoming, ...prevRows]);
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: { error.message }</p>;

    return <>
        <Paper>
            <DataGrid
                rows={ rows }
                columns={ props.columns }
                initialState={ { pagination: { paginationModel } } }
            />
        </Paper>
    </>
}

export default CustomList;
