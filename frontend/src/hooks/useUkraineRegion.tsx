import {useQuery} from "@apollo/client";
import {useCallback, useEffect, useState} from "react";
import {GET_UKRAINE_REGION} from "../graphql/requests";
import useSSE from './useSSE';

const useUkraineRegion = (): Array<{ id: number; title: string }> => {
    const [ukraineRegions, setUkraineRegions] = useState<Array<{ id: number; title: string }>>([]);

    const {data, loading} = useQuery(GET_UKRAINE_REGION, {
        fetchPolicy: 'no-cache',
    });

    useEffect(() => {
        if (data) {
            setUkraineRegions(data.getUkraineRegions.map((x: any) =>( { id: x.id, title: x.title })));
        }
    }, [data]);

    const handleData = useCallback((data: any) => {
        setUkraineRegions(prev => ([
            ...prev,
            { id: data.id, title: data.title },
        ]).sort(((a, b) => b.id - a.id)));
    }, []);


    useSSE(`http://localhost:3001/ukraine-region/sse`, 'getUkraineRegions', handleData);

    if (loading) {
        return [];
    }

    return ukraineRegions;
};

export default useUkraineRegion;
