import {Domain} from "../../../vocabulary/predictions";
import React from "react";
import {LineChart} from "@mui/x-charts";
import Grid from "@mui/material/Grid2";

type Props = {
    predictionsData: any[];
}


export const PredictionsByMonthsComponent: React.FC<Props> = (props: Props) => {
    const { predictionsData } = props;

    let lastDate = +new Date(predictionsData[0].year, predictionsData[0].month, 1);
    const monthDataset = predictionsData.reduce((acc: Record<string, any>, x: any) => {
        if (!acc[x.year]) {
            acc[x.year] = {};
        }
        if (!acc[x.year][x.month]) {
            acc[x.year][x.month] = 0;
        }
        acc[x.year][x.month] += x.count;
        lastDate = Math.max(lastDate, +new Date(x.year, x.month, 1))
        return acc;
    }, {})

    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Building next month for forecasting
    for (let nextMonthIndex = 1; nextMonthIndex <= 1; nextMonthIndex++) {
        const nextMonth = new Date(lastDate)
        nextMonth.setMonth(nextMonth.getMonth() + nextMonthIndex);
        if (!monthDataset[nextMonth.getFullYear()]) {
            monthDataset[nextMonth.getFullYear()] = {};
        }
        monthDataset[nextMonth.getFullYear()][nextMonth.getMonth()] = 0;
    }

    const diagramDatasetActual = [];
    const diagramDatasetForecast = [];

    let salesTotal = 0;
    let monthsTotal = 0;
    for (const year in monthDataset) {
        for (const month in monthDataset[year]) {
            if (+year <= currentYear && +month < currentMonth) {
                diagramDatasetActual.push({ date: new Date(+year, +month, 1), sales: monthDataset[year][month] });
                salesTotal += monthDataset[year][month];
                monthsTotal += 1;
            } else if (+year <= currentYear && +month === currentMonth) {
                // Placing current UNENDED month into forecasting
                const salesSoFar = monthDataset[year][month];
                const daysInThisMonth = new Date(+year, +month + 1, 0).getDate();
                const daysPassed = new Date().getDate();
                const estimatedSales = Math.floor(salesSoFar * (daysInThisMonth / daysPassed));


                diagramDatasetActual.push({ date: new Date(+year, +month, 1), sales: monthDataset[year][month] });
                diagramDatasetForecast.push({ date: new Date(+year, +month, 1), sales: estimatedSales });

                salesTotal += estimatedSales;
                monthsTotal += 1;
            } else {
                const estimatedSales = Math.floor(salesTotal / monthsTotal);
                // Pushing next months into forecasting
                diagramDatasetForecast.push({ date: new Date(+year, +month, 1), sales: estimatedSales });
                salesTotal += estimatedSales;
                monthsTotal += 1;
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

    const formatDate = (date: Date): string => {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year.toString().substring(2, 4)}/${month}`;
    };
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
                    width={500}
                    height={300}
                />
            </Grid>
        </>
    );
}

export default PredictionsByMonthsComponent;