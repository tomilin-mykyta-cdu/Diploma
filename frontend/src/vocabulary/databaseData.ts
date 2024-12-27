import {DocumentNode} from "@apollo/client";
import {
    CREATE_ANIMAL_SPECIES,
    CREATE_FEED, CREATE_FEED_RECEIPT,
    CREATE_FEED_SEGMENT,
    CREATE_INGREDIENT, CREATE_INGREDIENT_QUALITY, CREATE_MARKET_DEMAND, CREATE_PROVIDER, CREATE_UKRAINE_REGION
} from "../graphql/requests/mutations";
import {
    GET_ANIMAL_SPECIES, GET_FEED,
    GET_FEED_RECEIPT,
    GET_FEED_SEGMENT,
    GET_FEED_TITLE,
    GET_INGREDIENT, GET_PRODUCTIONS, GET_PROVIDER, GET_UKRAINE_REGION
} from "../graphql/requests";

export type StaticFormInput = {
    type: 'string';
    label: string;
    key: string;
    accessField?: string;
};
export type DynamicFormInput = {
    type: 'select',
    label: string;
    key: string;
    from: DocumentNode;
    fromKey: string;
    accessField?: string;
}
export type NewFormInput = StaticFormInput | DynamicFormInput;

export type NewFormStructure = {
    inputs: NewFormInput[];
    request: DocumentNode;
};

export type DatabaseVocabularyType = Record<string, NewFormStructure>;

export const DatabaseVocabulary: DatabaseVocabularyType = {
    NewAnimalSpecies: {
        inputs: [
            { type: 'string', label: 'Тваринка', key: 'title' },
        ],
        request: CREATE_ANIMAL_SPECIES
    },
    NewFeed: {
        inputs: [
            { type: 'select', label: 'Тваринка', key: 'animalSpecies', from: GET_ANIMAL_SPECIES, fromKey: 'getAnimalSpecies', },
            { type: 'select', label: 'Сегмент', key: 'feedSegment', from: GET_FEED_SEGMENT, fromKey: 'getFeedSegments', },
            { type: 'select', label: 'Корм', key: 'feedTitle', from: GET_FEED_TITLE, fromKey: 'getFeedTitles', },
        ],
        request: CREATE_FEED
    },
    NewFeedReceipt: {
        inputs: [
            { type: 'select', label: 'Корм', key: 'feedReceipt', from: GET_FEED, fromKey: 'getFeeds', },
            { type: 'select', label: 'Інгредієнт', key: 'ingredient', from: GET_INGREDIENT, fromKey: 'getIngredients', },
        ],
        request: CREATE_FEED_RECEIPT,
    },
    NewFeedSegment: {
        inputs: [
            { type: 'string', label: 'Сегмент', key: 'title' },
        ],
        request: CREATE_FEED_SEGMENT,
    },
    NewIngredient: {
        inputs: [
            { type: 'string', label: 'Інгредієнт', key: 'title' },
        ],
        request: CREATE_INGREDIENT,
    },/*
    NewIngredientQuality: {
        inputs: [
            { type: 'select', label: 'Інгредієнт', key: 'ingredient', from: GET_INGREDIENT, fromKey: 'getIngredients', },
            { type: 'select', label: 'Постачальник', key: 'provider', from: GET_PROVIDER, fromKey: 'getProviders', },
            { type: 'select', label: 'Сегмент', key: 'feedSegment', from: GET_FEED_SEGMENT, fromKey: 'getFeedSegments', },
            { type: 'string', label: 'Ціна', key: 'price' },
        ],
        request: CREATE_INGREDIENT_QUALITY,
    },
    */NewMarketDemand: { // TODO: production
        inputs: [
            { type: 'select', label: 'Корм', key: 'production', from: GET_PRODUCTIONS, fromKey: 'getProductions', accessField: 'feed.feedTitle.title' },
            { type: 'select', label: 'Область', key: 'ukraineRegion', from: GET_UKRAINE_REGION, fromKey: 'getUkraineRegions', },
            { type: 'string', label: 'Ціна', key: 'price' },],
        request: CREATE_MARKET_DEMAND,
    },
    NewProduction: { // TODO: feed
        inputs: [
            { type: 'select', label: 'Корм', key: 'feed', from: GET_FEED, fromKey: 'getFeeds', },
        ],
        request: CREATE_FEED,
    },
    NewProvider: {
        inputs: [
            { type: 'string', label: 'Постачальник', key: 'title' },
        ],
        request: CREATE_PROVIDER,
    },
    NewUkraineRegion: {
        inputs: [
            { type: 'string', label: 'Область', key: 'title' },
        ],
        request: CREATE_UKRAINE_REGION,
    },
}
