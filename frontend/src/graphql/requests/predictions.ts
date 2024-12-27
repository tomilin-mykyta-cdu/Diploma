import {gql} from "@apollo/client";

export const GET_MARKET_DEMAND_FORECAST_AMOUNT_DATA = gql`
    query GetMarketDemandsForecastAmount($filter: GetMarketDemandDtoForecastAmount){
        getMarketDemandsForecastAmount(filter: $filter) {
            records {
                count,
                year,
                month,
                week
            }
        }
    }
`;

export const GET_PREDICTIONS = gql`
    query GetPredictions {
        getPredictions {
            feedSegment { id, title },
            feedTitle { id, title },
            animalSpecies { id, title },
            ukraineRegion { id, title },
            prediction
        }
    }
`;