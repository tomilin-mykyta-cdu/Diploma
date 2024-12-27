type FirstSubstring<PathString extends string> = PathString extends `${infer First}.${string}` ? First : never;
type AfterFirstSubstring<PathString extends string> = PathString extends `${string}.${infer Rest}` ? Rest : never;

export type Extract<
    EntityType extends Record<string, any>[],
    PathString extends string,
    ResultString extends string = '',
> =
    FirstSubstring<PathString> extends never ?
        PathString extends keyof EntityType[number] ?
            ResultString extends '' ?
                PathString :
                `${ResultString}.${PathString}` :
            never
        :
        FirstSubstring<PathString> extends keyof EntityType[number] ?
            Extract<
                (EntityType[number])[FirstSubstring<PathString>],
                AfterFirstSubstring<PathString>,
                ResultString extends '' ?
                    FirstSubstring<PathString> :
                    `${ResultString}.${FirstSubstring<PathString>}`
            >
            : never;

export function extractArrayFromObjectIDontCare(
    array: any[],
    key: string,
    resultArray: any[] = []
) {
    if (!key) {
        resultArray.push(array);
        return array;
    }
    const keys: string[] = key.toString().split('.');

    if (Array.isArray(array)) {
        for (const value of array) {
            const current = value[keys[0]];
            if (Array.isArray(current)) {
                if (keys.length === 1) {
                    resultArray.push(current[0]);
                } else {
                    extractArrayFromObjectIDontCare(current, keys.slice(1).join('.'), resultArray);
                }
            } else {
                extractArrayFromObjectIDontCare(current, keys.slice(1).join('.'), resultArray);
            }
        }
    } else {
        const current = array[keys[0]];
        if (Array.isArray(current)) {
            if (keys.length === 1) {
                resultArray.push(current[0]);
            } else {
                extractArrayFromObjectIDontCare(current, keys.slice(1).join('.'), resultArray);
            }
        } else {
            extractArrayFromObjectIDontCare(current, keys.slice(1).join('.'), resultArray);
        }
    }

    return resultArray;
}
export function extractArrayFromObject<
    EntityType extends Record<string, any>,
    PathString extends string
>(
    array: EntityType[],
    key: Extract<EntityType[], PathString>,
    resultArray: any[] = []
): any[] {

    if (!key) {
        return array;
    }

    const keys: string[] = key.toString().split('.');

    for (const value of array) {
        const current = value[keys[0]];
        if (Array.isArray(current)) {
            if (keys.length === 1) {
                resultArray.push(...current);
            } else {
                extractArrayFromObject(current, keys.slice(1).join('.'), resultArray);
            }
        }
    }

    return resultArray;
}

export function buildPieChartData(
    array: any[],
    idKey: string,
    parser: (x: any) => ({ id: any; value: number; label: string})
): Array<{ id: any; value: number; label: string}> {
    return Object.values(array.reduce((acc: any, as: any) => {
        if (acc[as[idKey]] === undefined) {
            acc[as[idKey]] = parser(as);
        }
        acc[as[idKey]].value += 1;
        return acc;
    }, {})) as any;
}

export function flattenObjects(objects: any) {
    const result: any = [];

    function flattenObject(obj: any, parentKey = '', currentResult: any = {}) {
        if (Array.isArray(obj)) {
            // For arrays, recursively flatten each item, carrying the current result
            obj.forEach(item => flattenObject(item, parentKey, { ...currentResult }));
        } else if (obj !== null && typeof obj === 'object') {
            // If the current item is an object, recursively process its properties
            for (const [key, value] of Object.entries(obj)) {
                const newKey = parentKey ? `${parentKey}_${key}` : key;
                flattenObject(value, newKey, currentResult);
            }
        } else {
            // If it's a primitive value, add it to the current result
            currentResult[parentKey] = obj;
        }

        if (Object.keys(currentResult).length > 0 && !result.includes(currentResult)) {
            result.push(currentResult);
        }
    }

    objects.forEach((obj: any) => flattenObject(obj));
    return result;
}
