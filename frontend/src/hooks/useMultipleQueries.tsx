import {useQuery} from "@apollo/client";
import { DocumentNode } from "graphql";

type QueryResult = {
    data?: any;
    loading: boolean;
    error?: any;
};

const useMultipleQueries = (queries: DocumentNode): QueryResult => {
    const { data, loading, error } = useQuery(queries, { fetchPolicy: 'network-only' });
    return { data, loading, error };
};

export default useMultipleQueries;
