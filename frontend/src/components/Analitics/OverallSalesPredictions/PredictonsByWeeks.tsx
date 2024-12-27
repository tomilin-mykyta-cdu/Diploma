import {Domain} from "../../../vocabulary/predictions";
import React from "react";
import {LineChart} from "@mui/x-charts";
import Grid from "@mui/material/Grid2";
import {getMonth, getWeekMonday, getWeekNumber} from "../../../utils/date.utils";

type Props = {
    predictionsData: any[];
    width?: number;
}


export const PredictionsByWeeksComponent: React.FC<Props> = (props: Props) => {
    const { predictionsData, width = 500 } = props;

    let lastDate = +new Date(predictionsData[0].year, predictionsData[0].month, 1);
    const weeksDataset = predictionsData.reduce((acc: Record<string, any>, x: any) => {
        if (!acc[x.year]) {
            acc[x.year] = {};
        }
        if (!acc[x.year][x.week]) {
            acc[x.year][x.week] = 0;
        }
        acc[x.year][x.week] += x.count;
        lastDate = Math.max(lastDate, +new Date(x.year, x.month, 1))
        return acc;
    }, {})

    const now = new Date();

    const currentWeek = getWeekNumber(now);
    const currentYear = now.getFullYear();

    // Building next month for forecasting
    for (let nextMonthIndex = 1; nextMonthIndex <= 2; nextMonthIndex++) {
        const nextMonth = new Date(lastDate)
        nextMonth.setMonth(nextMonth.getMonth() + nextMonthIndex);
        if (!weeksDataset[nextMonth.getFullYear()]) {
            weeksDataset[nextMonth.getFullYear()] = {};
        }
        weeksDataset[nextMonth.getFullYear()][getWeekNumber(nextMonth)] = 0;
    }

    const diagramDatasetActual = [];
    const diagramDatasetForecast = [];

    let salesTotal = 0;
    let weeksTotal = 0;
    for (const year in weeksDataset) {
        for (const week in weeksDataset[year]) {
            if (+year <= currentYear && +week < currentWeek) {
                diagramDatasetActual.push({ date: getWeekMonday(+year, +week), sales: weeksDataset[year][week] });
                salesTotal += weeksDataset[year][week];
                weeksTotal += 1;
            } else if (+year <= currentYear && +week === currentWeek) {
                const salesSoFar = weeksDataset[year][week];
                const daysInThisMonth = getWeekMonday(+year, +week + 1).getDate();
                const daysPassed = new Date().getDate();
                const estimatedSales = Math.floor(salesSoFar * (daysInThisMonth / daysPassed));


                diagramDatasetActual.push({ date: getWeekMonday(+year, +week), sales: weeksDataset[year][week] });
                diagramDatasetForecast.push({ date: getWeekMonday(+year, +week), sales: estimatedSales });

                salesTotal += estimatedSales;
                weeksTotal += 1;
            } else {
                const estimatedSales = Math.floor(salesTotal / weeksTotal);
                diagramDatasetForecast.push({ date: getWeekMonday(+year,+week), sales: estimatedSales });
                salesTotal += estimatedSales;
                weeksTotal += 1;
            }
        }
    }

    const combinedDataset = [
        ...diagramDatasetActual,
        ...diagramDatasetForecast.map(item => ({ date: item.date, sales: null })),
    ];

    const forecastData = [
        ...diagramDatasetActual.map(() => null),
        ...diagramDatasetForecast.map(item => item.sales),
    ];

    const formatDate = (date: Date): string => `${getWeekNumber(date)} тиждень`;

    return (
        <>
            <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                <LineChart
                    dataset={combinedDataset }
                    xAxis={[
                        {
                            id: 'Year',
                            dataKey: 'date',
                            scaleType: 'band',
                            valueFormatter: (date) => formatDate(new Date(date)),
                        },
                    ]}
                    series={[
                        {
                            id: 'Sales',
                            stack: 'sales',
                            dataKey: 'sales',
                            data: diagramDatasetActual.map(x => x.sales),
                            color: 'gray',
                            label: 'Продажі'
                        },

                        {
                            id: 'Sales1',
                            stack: 'sales1',
                            data: forecastData,
                            color: 'red',
                            label: 'Прогнозовані продажі'
                        }
                    ]}
                    width={width}
                    height={300}
                />
            </Grid>
        </>
    );
}

export default PredictionsByWeeksComponent;