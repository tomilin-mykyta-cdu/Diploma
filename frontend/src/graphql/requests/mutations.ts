import {gql} from "@apollo/client";

export const CREATE_ANIMAL_SPECIES = gql`
    mutation CreateAnimalSpecies($title: String!) {
        createAnimalSpecies(body: { title: $title }) {
            id
        }
    }
`

export const CREATE_FEED = gql`
    mutation CreateFeed($animalSpecies: Int!, $feedSegment: Int!, $feedTitle: Int!){
        createFeed(body: {
            animalSpecies: $animalSpecies,
            feedSegment: $feedSegment,
            feedTitle: $feedTitle
        }) {
            id
        }
    }
`

export const CREATE_FEED_RECEIPT = gql`
    mutation CreateFeedReceipt($feed: Int!, $feedIngredient: Int!){
        createFeedReceipt(body: {
            feed: $feed,
            feedIngredient: $feedIngredient
        }) {
            id
        }
    }
`

export const CREATE_FEED_SEGMENT = gql`
    mutation CreateFeedSegment($title: String!) {
        createFeedSegment(body: {
            title: $title,
        }) {
            id
        }
    }
`;

export const CREATE_FEED_TITLE = gql`
    mutation CreateFeedTitle($title: String!) {
        createFeedTitle(body: {
            title: $title,
        }) {
            id
        }
    }
`;

export const CREATE_INGREDIENT = gql`
    mutation CreateIngredient($title: String!) {
        createIngredient(body: {
            title: $title,
        }) {
            id
        }
    }
`;

export const CREATE_INGREDIENT_QUALITY = gql`
    mutation CreateIngredientQuality($ingredient: Int!, $provider: Int!, $feedSegment: Int!, $price: Int!) {
        createIngredientQuality(body: {
            ingredient: $ingredient,
            provider: $provider,
            feedSegment: $feedSegment,
            price: $price
        }) {
            id
        }
    }`;

export const CREATE_MARKET_DEMAND = gql`
    mutation CreateMarketDemand($production: Int!,$ukraineRegion: Int!,$price: Int!) {
        createMarketDemand(body: {
            production: $production,
            ukraineRegion: $ukraineRegion,
            price: $price
        }) {
            id
        }
    }
`;

export const CREATE_PRODUCTION = gql`
    mutation CreateProduction($feed: Int!) {
        createProduction(body: {
            feed: $feed
        }) {
            id
        }
    }
`;

export const CREATE_UKRAINE_REGION = gql`
    mutation CreateUkraineRegion($title: String!) {
        createUkraineRegion(body: {
            title: $title
        }) {
            id
        }
    }
`;

export const CREATE_PROVIDER = gql`
    mutation CreateProvider($title: String!) {
        createProvider(body: {
            title: $title
        }) {
            id
        }
    }
`;