import {useQuery} from "@apollo/client";
import {useCallback, useEffect, useState} from "react";
import {GET_FEED_TITLE} from "../graphql/requests";
import useSSE from './useSSE';

const useFeedTitles = (): Array<{ id: number; title: string }> => {
    const [feedTitles, setFeedTitles] = useState<Array<{ id: number; title: string }>>([]);

    const {data, loading} = useQuery(GET_FEED_TITLE, {
        fetchPolicy: 'no-cache',
    });
    useEffect(() => {
        if (data) {
            setFeedTitles(data.getFeedTitles.map((x: any) =>( { id: x.id, title: x.title })));
        }
    }, [data]);

    const handleData = useCallback((data: any) => {
        setFeedTitles(prev => ([
            ...prev,
            { id: data.id, title: data.title },
        ]).sort(((a, b) => b.id - a.id)));
    }, []);

    useSSE(`http://localhost:3001/feed-title/sse`, 'getFeedTitles', handleData);

    if (loading) {
        return [];
    }

    return feedTitles;
};

export default useFeedTitles;
