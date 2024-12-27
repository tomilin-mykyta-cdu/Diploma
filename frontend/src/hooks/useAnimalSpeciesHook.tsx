import { useQuery } from '@apollo/client';
import {useCallback, useEffect, useState} from 'react';
import { GET_ANIMAL_SPECIES } from '../graphql/requests';
import useSSE from './useSSE';

const useAnimalSpeciesHook = (): Array<{ id: number; title: string }> => {
    const [animalSpeciesData, setAnimalSpeciesData] = useState<Array<{ id: number; title: string }>>([]);
    const { data, loading } = useQuery(GET_ANIMAL_SPECIES, {
        fetchPolicy: 'no-cache',
    });

    useEffect(() => {
        if (data) {
            setAnimalSpeciesData(data.getAnimalSpecies.map((x: any) => ({ id: x.id, title: x.title })));
        }
    }, [data]);

    const handleData = useCallback((data: any) => {
        setAnimalSpeciesData(prev => ([
            ...prev,
            { id: data.id, title: data.title },
        ]).sort(((a, b) => b.id - a.id)));
    }, []);

    useSSE(`http://localhost:3001/animal-species/sse`, 'getAnimalSpecies', handleData);

    if (loading) {
        return [];
    }

    return animalSpeciesData;
};

export default useAnimalSpeciesHook;
