import React, {useState} from "react";
import {Domain, Variable, VariableQuery, VocabularyPredictions} from "../../vocabulary/predictions";
import {useQuery} from "@apollo/client";
import {GET_MARKET_DEMAND_FORECAST_AMOUNT_DATA} from "../../graphql/requests/predictions";
import useMultipleQueries from "../../hooks/useMultipleQueries";
import {getWeekNumber} from "../../utils/date.utils";
import {LineChart} from "@mui/x-charts";
import ChartFilters from "../Chart/ChartFilters";
import {Typography} from "@mui/material";


type Props = {
    domain: any;
    filter: any;
}

export const PredictionsByParameter: React.FC<Props> = (props) => {
    const { domain, filter } = props;
    const vocabularyData = VocabularyPredictions[props.domain.vocabulary];
    return <>12312312312313123121321</>
    // console.log();
    // const variables = vocabularyData.variables!;
    //
    // const [pickedFilterNames, setPickedFilterNames] = useState<string[]>([]);
    // const [dynamicFilters, setDynamicFilters] = useState(
    //     variables?.reduce(
    //         (acc, variable) => {
    //             if (variable.type === 'date') {
    //                 acc[variable.key] = variable.default ?? null;
    //             } else {
    //                 acc[variable.key] = [];
    //             }
    //             return acc;
    //         },
    //         {} as any,
    //     )
    // );
    //
    // const {
    //     loading: predictions_loading,
    //     error: predictions_error,
    //     data: predictions_data
    // } = useQuery(GET_MARKET_DEMAND_FORECAST_AMOUNT_DATA, {
    //     fetchPolicy: 'no-cache',
    //     variables: {
    //         filter: {
    //             ...dynamicFilters,
    //             period: 'weekly'
    //         },
    //     },
    // });
    //
    // const dependenciesResponses = variables
    //     .filter((x: Variable): x is VariableQuery => x.type !== 'date')
    //     .map(x => x.query!);
    //
    // const multipleQueriesResults = dependenciesResponses.map(useMultipleQueries);
    //
    // if ((multipleQueriesResults.length && multipleQueriesResults.map(x => x.loading).some(Boolean))) return <p>Loading...</p>;
    // if ((multipleQueriesResults.length && multipleQueriesResults.map(x => x.error).some(Boolean))) return <p>Error</p>;
    // if (!predictions_data) return <p>Loading123...</p>;
    //
    // const formatDate = (date: Date): string => {
    //     const month = date.getMonth() + 1;
    //     const year = date.getFullYear();
    //     return `${year.toString().substring(2, 4)}/${month}`;
    // };
    //
    // const predictionsData = predictions_data['getMarketDemandsForecastAmount']?.['records'] ?? [];
    //
    // let lastDate = +new Date(predictionsData[0].year, predictionsData[0].month, 1);
    // const monthDataset = predictionsData.reduce((acc: Record<string, any>, x: any) => {
    //     if (!acc[x.year]) {
    //         acc[x.year] = {};
    //     }
    //     if (!acc[x.year][x.month]) {
    //         acc[x.year][x.month] = 0;
    //     }
    //     acc[x.year][x.month] += x.count;
    //     lastDate = Math.max(lastDate, +new Date(x.year, x.month, 1))
    //     return acc;
    // }, {})
    //
    // const now = new Date();
    //
    // const currentMonth = now.getMonth();
    // const currentYear = now.getFullYear();
    //
    // // Building next month for forecasting
    // for (let nextMonthIndex = 1; nextMonthIndex <= 3; nextMonthIndex++) {
    //     const nextMonth = new Date(lastDate)
    //     nextMonth.setMonth(nextMonth.getMonth() + nextMonthIndex);
    //     if (!monthDataset[nextMonth.getFullYear()]) {
    //         monthDataset[nextMonth.getFullYear()] = {};
    //     }
    //     monthDataset[nextMonth.getFullYear()][nextMonth.getMonth()] = 0;
    // }
    //
    // const diagramDatasetActual = [];
    // const diagramDatasetForecast = [];
    //
    // let salesTotal = 0;
    // let monthsTotal = 0;
    // for (const year in monthDataset) {
    //     for (const month in monthDataset[year]) {
    //         if (+year <= currentYear && +month < currentMonth) {
    //             diagramDatasetActual.push({ date: new Date(+year, +month, 1), sales: monthDataset[year][month] });
    //             salesTotal += monthDataset[year][month];
    //             monthsTotal += 1;
    //         } else if (+year <= currentYear && +month === currentMonth) {
    //             // Placing current UNENDED month into forecasting
    //             const salesSoFar = monthDataset[year][month];
    //             const daysInThisMonth = new Date(+year, +month + 1, 0).getDate();
    //             const daysPassed = new Date().getDate();
    //             const estimatedSales = Math.floor(salesSoFar * (daysInThisMonth / daysPassed));
    //
    //
    //             diagramDatasetActual.push({ date: new Date(+year, +month, 1), sales: monthDataset[year][month] });
    //             diagramDatasetForecast.push({ date: new Date(+year, +month, 1), sales: estimatedSales });
    //
    //             salesTotal += estimatedSales;
    //             monthsTotal += 1;
    //         } else {
    //             const estimatedSales = Math.floor(salesTotal / monthsTotal);
    //             // Pushing next months into forecasting
    //             diagramDatasetForecast.push({ date: new Date(+year, +month, 1), sales: estimatedSales });
    //             salesTotal += estimatedSales;
    //             monthsTotal += 1;
    //         }
    //     }
    // }
    //
    //
    // const combinedDataset = [
    //     ...diagramDatasetActual,
    //     ...diagramDatasetForecast.map(item => ({ date: item.date, sales: null })),
    // ];
    //
    // const forecastData = [
    //     ...diagramDatasetActual.map(() => null),
    //     ...diagramDatasetForecast.map(item => item.sales),
    // ];
    //
    // return <>
    //     <Typography variant="h4" component="div">
    //     Прогнозування продажів
    //     </Typography>
    //     <LineChart
    //         dataset={combinedDataset }
    //         xAxis={[
    //             {
    //                 id: 'Year',
    //                 dataKey: 'date',
    //                 scaleType: 'band',
    //                 valueFormatter: (date) => formatDate(new Date(date)),
    //             },
    //         ]}
    //         series={[
    //             {
    //                 id: 'Sales',
    //                 stack: 'sales',
    //                 dataKey: 'sales',
    //                 data: diagramDatasetActual.map(x => x.sales),
    //                 color: 'gray',
    //                 label: 'Продажі'
    //             },
    //
    //             {
    //                 id: 'Sales1',
    //                 stack: 'sales1',
    //                 data: forecastData,
    //                 color: 'red',
    //                 label: 'Прогнозовані продажі'
    //             }
    //         ]}
    //         width={500}
    //         height={300}
    //     />
    //     <ChartFilters
    //         variables={variables}
    //         multipleQueriesResults={multipleQueriesResults as any}
    //         setDynamicFilters={(value) => setDynamicFilters(value)}
    //         dynamicFilters={dynamicFilters}
    //         pickedFilterNames={pickedFilterNames}
    //         setPickedFilterNames={setPickedFilterNames}
    //         key={`chart-filters-${props.entity}-${JSON.stringify(dynamicFilters)}`}
    //     />
    // </>
}

export default PredictionsByParameter;