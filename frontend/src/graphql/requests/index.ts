import {gql} from "@apollo/client";

export const GET_MARKET_DEMAND_DATA = gql`
    query GetManyMarketDemand($filter: GetMarketDemandDto){
        getMarketDemands(filter: $filter) {
            id,
            createdAt,
            ukraineRegion {
                id,
                title,
                createdAt
            },
            production {
                id,
                feed {
                    id,
                    animalSpecies { id, title },
                    feedSegment { id, title },
                    feedTitle { title },
                }
            }
        }
    }
`;

export const GET_MARKET_DEMAND_FORECAST_DATA = gql`
    query GetMarketDemandsForecast($filter: GetMarketDemandDto){
        getMarketDemandsForecast(filter: $filter) {
            id,
            createdAt,
            prediction,
            ukraineRegion {
                id,
                title,
                createdAt
            },
            production {
                id,
                feed {
                    id,
                    animalSpecies { id, title },
                    feedSegment { id, title },
                    feedTitle { title },
                }
            }
        }
    }
`;

export const GET_PRODUCTIONS = gql`
    query GetProductions($filter: GetProductionQueryDto) {
        getProductions(filter: $filter) {
            id,
            amount,
            createdAt,
            feed {
                id,
                animalSpecies { id, title },
                feedSegment { id, title },
                feedTitle { title },
            }
        }
    }
`;

export const GET_FEED_TITLE = gql`
    query getFeedTitles($filter: GetFeedTitleQuery) {
        getFeedTitles(filter: $filter) {
            id,
            title
        }
    }
`;

export const GET_ANIMAL_SPECIES = gql`
    query getAnimalSpecies($filter: GetAnimalSpeciesQuery) {
        getAnimalSpecies(filter: $filter) {
            id,
            title,
            feed {
                feedTitle { title } 
            }
        }
    }
`;

export const GET_FEED = gql`
    query GetFeed($filter: GetFeedQuery) {
        getFeed(filter: $filter) {
            id,
            feedSegment { id, title,},
            animalSpecies { id, title },
            feedTitle { title },
        }
    }
`;

export const GET_FEED_RECEIPT = gql`
    query GetFeedReceipts($filter: GetFeedReceiptQueryFilter) {
        getFeedReceipts(filter: $filter) {
            id,
            feed { 
                id,
                animalSpecies { id, title },
                feedSegment { id, title },
                feedTitle { title },
            }
            ingredient {
                id,
                title
            }
        }
    }
`;

export const GET_FEED_SEGMENT = gql`
    query GetFeedSegments($filter: GetFeedSegmentQueryDto) {
        getFeedSegments(filter: $filter) {
            id,
            title
        }
    }
`;

export const GET_INGREDIENT = gql`
    query GetIngredients($filter: GetIngredientQueryDto) {
        getIngredients(filter: $filter) {
            id,
            title
        }
    }
`;

export const GET_INGREDIENT_QUALITY = gql`
    query {
        id  
    }
`;

export const GET_PROVIDER = gql`
    query GetProviders($filter: GetProviderQueryDto) {
        getProviders(filter: $filter) {
            id,
            title
        }
    }
`;

export const GET_UKRAINE_REGION = gql`
    query GetUkraineRegions($filter: GetUkraineRegionQueryDto) {
        getUkraineRegions(filter: $filter) {
            id,
            title
        }
    }
`;