import {
    GET_ANIMAL_SPECIES, GET_FEED,
    GET_FEED_SEGMENT,
    GET_FEED_TITLE,
    GET_MARKET_DEMAND_DATA,
    GET_PRODUCTIONS, GET_UKRAINE_REGION
} from '../graphql/requests';
import {DocumentNode} from "@apollo/client";

export type Entity = {
    key: string;
    label: string;
    parser: (x: any) => { id: string; value: number; label: string };
    parserKey: string;

}
type Instances = Record<string, Entity>;

export type VariableQuery = {
    key: string;
    label: string;
    type: 'number' | 'string';
    query: DocumentNode | null;
    responseKey: string;
    fieldKey: string;
};
export type VariableDate = {
    key: string;
    label: string;
    type: 'date';
}

export type Variable = VariableQuery | VariableDate;

export type Domain = {
    request: any;
    responseKey: string;
    instances: Instances;
    variables?: Array<Variable>
    relations?: any; // TODO, required
    subscribeAddress: string;
};

export type VocabularyObject = Record<string, Domain>;



export const Vocabulary: VocabularyObject = {
    MarketDemand: {
        request: GET_MARKET_DEMAND_DATA,
        responseKey: 'getMarketDemands',
        subscribeAddress: 'market-demand/sse',
        variables: [
            { query: GET_ANIMAL_SPECIES, type: 'string', key: 'animalSpeciesTitle', responseKey: 'getAnimalSpecies', label: 'Тваринка', fieldKey: 'title' },
            { query: GET_FEED_SEGMENT, type: 'string', key: 'feedSegmentTitle', responseKey: 'getFeedSegments', label: 'Сегмент', fieldKey: 'title' },
            { query: GET_FEED_TITLE, type: 'string', key: 'feedTitle', responseKey: 'getFeedTitles', label: 'Корм', fieldKey: 'title' },
            { query: GET_UKRAINE_REGION, type: 'string', key: 'ukraineRegionTitle', responseKey: 'getUkraineRegions', label: 'Область', fieldKey: 'title' },

            { type: 'date', key: 'createdAfter', label: 'Проданий після' },
            { type: 'date', key: 'createdBefore', label: 'Проданий до' },
            { type: 'date', key: 'productionCreatedBefore', label: 'Вироблений до' },
            { type: 'date', key: 'productionCreatedAfter', label: 'Вироблений після' },
        ],
        instances: {
            ukraineRegion: {
                key: 'ukraineRegion',
                label: 'Область',
                parser: (x: any) => ({ id: x.id, label: x.title.split(' ')[0], value: 0 }),
                parserKey: 'id',
            },
            feedTitle: {
                key: 'production.feed.feedTitle',
                label: 'Корм',
                parser: (x: any) => ({ id: x.title, label: x.title, value: 0 }),
                parserKey: 'title',
            },
            animalSpecies: {
                key: 'production.feed.animalSpecies',
                label: 'Тварина',
                parser: (x: any) => ({ id: x.id, label: x.title, value: 0 }),
                parserKey: 'id',
            },
            feedSegment: {
                key: 'production.feed.feedSegment',
                label: 'Клас корму',
                parser: (x: any) => ({ id: x.id, label: x.title, value: 0 }),
                parserKey: 'id',
            },
        } ,
    },
    Productions: {
        request: GET_PRODUCTIONS,
        responseKey: 'getProductions',
        subscribeAddress: 'production/sse',
        variables: [
            { query: GET_FEED_TITLE, type: 'string', key: 'feedTitle', responseKey: 'getFeedTitles', label: 'Корм', fieldKey: 'title' },
            { query: GET_ANIMAL_SPECIES, type: 'string', key: 'animalSpeciesTitle', responseKey: 'getAnimalSpecies', label: 'Тваринка', fieldKey: 'title' },
            { query: GET_FEED_SEGMENT, type: 'string', key: 'feedSegmentTitle', responseKey: 'getFeedSegments', label: 'Сегмент', fieldKey: 'title' },
        ],
        instances: {
            feed: {
                key: 'feed.feedTitle',
                label: 'Корм',
                parser: (x: any) => {
                    return ({ id: x.title, label: x.title, value: 0 })
                },
                parserKey: 'title',
            },
            animalSpecies: {
                key: 'feed.animalSpecies',
                label: 'Тварина',
                parser: (x: any) => ({ id: x.id, label: x.title, value: 0 }),
                parserKey: 'id',
            },
            feedSegment: {
                key: 'feed.feedSegment',
                label: 'Клас корму',
                parser: (x: any) => ({ id: x.id, label: x.title, value: 0 }),
                parserKey: 'id',
            },
        } ,
    },

    // AnimalSpecies: {
    //     request: GET_ANIMAL_SPECIES,
    //     responseKey: 'getAnimalSpecies',
    //     variables: [
            // { query: GET_FEED_TITLE, type: 'string', key: 'feedTitle', responseKey: 'getFeedTitles', label: 'Корм', fieldKey: 'title' },
        // ],
        // instances: {
            // animalSpecies: {
            //     key: 'title',
            //     label: 'Тварина',
            //     parser: (x: any) => {
            //         return ({ id: x.title, label: x.title, value: 0 })
            //     },
            //     parserKey: 'title',
            // },
        //     feed: {
        //         key: 'feed.feedTitle',
        //         label: 'Корм',
        //         parser: (x: any) => {
        //             return ({ id: x.title, label: x.title, value: 0 })
        //         },
        //         parserKey: 'title',
        //     },
        // },
    // },
    // FeedReceipt: {
    //     request: GET_MARKET_DEMAND_DATA,
    //     responseKey: 'getManyMarketDemand',
    //     instances: {}
    // },
    // FeedSegment: {
    //     request: GET_FEED_SEGMENT,
    //     responseKey: 'getFeedSegments',
    //     variables: [],
    //     instances: {
    //         feedSegment: {
    //             key: 'title',
    //             label: 'Сегмент',
    //             parser: (x: any) => {
    //                 return ({ id: x.title, label: x.title, value: 0 })
    //             },
    //             parserKey: 'title',
    //         },
    //     }
    // },
    // Ingredient: {
    //     request: GET_MARKET_DEMAND_DATA,
    //     responseKey: 'getManyMarketDemand',
    //     instances: {}
    // },
    // IngredientQuality: {
    //     request: GET_MARKET_DEMAND_DATA,
    //     responseKey: 'getManyMarketDemand',
    //     instances: {}
    // },
    // Provider: {
    //     request: GET_MARKET_DEMAND_DATA,
    //     responseKey: 'getManyMarketDemand',
    //     instances: {}
    // },
    // UkraineRegion: {
    //     request: GET_UKRAINE_REGION,
    //     responseKey: 'getUkraineRegion',
    //     variables: [],
    //     instances: {
    //         ukraineRegion: {
    //             key: 'title',
    //             label: 'Область',
    //             parser: (x: any) => {
    //                 return ({ id: x.title, label: x.title, value: 0 })
    //             },
    //             parserKey: 'title',
    //         },
    //     }
    // },
};

export const VocabularyDomains = Object.keys(Vocabulary);
