import {useQuery} from "@apollo/client";
import {useCallback, useEffect, useState} from "react";
import {GET_FEED_SEGMENT} from "../graphql/requests";
import useSSE from "./useSSE";

const useFeedSegment = (): Array<{ id: number; title: string }> => {
    const [feedSegments, setFeedSegments] = useState<Array<{ id: number; title: string }>>([]);

    const {data, loading} = useQuery(GET_FEED_SEGMENT, {
        fetchPolicy: 'no-cache',
    });

    useEffect(() => {
        if (data) {
            setFeedSegments(data.getFeedSegments.map((x: any) =>( { id: x.id, title: x.title })));
        }
    }, [data]);

    const handleData = useCallback((data: any) => {
        setFeedSegments(prev => ([
            ...prev,
            { id: data.id, title: data.title },
        ]).sort(((a, b) => b.id - a.id)));
    }, []);

    useSSE(`http://localhost:3001/feed-segments/sse`, 'getFeedSegments', handleData);

    if (loading) {
        return [];
    }

    return feedSegments;
};

export default useFeedSegment;
