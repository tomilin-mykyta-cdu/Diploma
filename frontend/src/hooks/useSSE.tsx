import {useCallback, useEffect, useMemo} from 'react';
import { getService } from '../sse/sseService';

const useSSE = (url: string, key: string, callback: (data: any) => void, id = '1') => {
    const stableCallback = useCallback(callback, []);

    useEffect(() => {
        const event = getService(url, key);
        // console.log(`subscribe: ${url}`);
        event.subscribe(url, stableCallback);

        return () => {
            // console.log(`UNsubscribe: ${url}`);
            event.unsubscribe(url, stableCallback);
        };
    }, [url, stableCallback, key]);
};

export default useSSE;
