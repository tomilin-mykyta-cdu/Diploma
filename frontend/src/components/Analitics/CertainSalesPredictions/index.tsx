import React, {useEffect, useState} from "react";
import {Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {useQuery} from "@apollo/client";
import {GET_PREDICTIONS} from "../../../graphql/requests/predictions";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useSSE from "../../../hooks/useSSE";

type Props = {}

export const OverallSalesPredictions: React.FC<Props> = (props) => {
    const [fetchedData, setFetchedData] = useState<any>([]);
    const [dataToShow, setDataToShow] = React.useState<any[]>([]);
    const percentsMap = [0.1, 0.33, 0.5];

    const {loading, error, data} = useQuery(GET_PREDICTIONS, {
        fetchPolicy: 'no-cache',
    });

    const [componentIndex, setComponentIndex] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setComponentIndex(newValue);
    };

    useSSE(`http://localhost:3001/market-demand/getPredictions/sse`, 'getPredictions', (sseData) => {
        console.log(`useSSE`)
        setFetchedData(sseData.sort((a: any, b: any) => b.prediction - a.prediction));
    });

    useEffect(() => {
        if (data) {
            setFetchedData(() => data.getPredictions.sort((a: any, b: any) => b.prediction - a.prediction));
        }
    }, [data]);

    const sumAllSellings = fetchedData?.reduce((acc: number, cur: any) => acc + cur.prediction, 0);

    const getPercentage = (d: any, percentage: number) => {
        const percentSum = Math.floor(sumAllSellings * percentage);
        let sumOfSellings = 0;

        const topSellings = [];
        for (const fd of d) {
            if (sumOfSellings < percentSum) {
                topSellings.push(fd);
                sumOfSellings += fd.prediction;
            } else {
                break;
            }
        }

        return topSellings;
    }

    useEffect(() => {
        switch (componentIndex) {
            case 0:
                setDataToShow(getPercentage(fetchedData, 0.1))
                return;
            case 1:
                setDataToShow(getPercentage(fetchedData, 0.33))
                return;
            case 2:
                setDataToShow(getPercentage(fetchedData, 0.5))
                return;
        }
    }, [fetchedData, componentIndex]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;
    if (!dataToShow) return <p>Loading (no data)...</p>;

    const filterByField = (field: string) => {
        const map = dataToShow.reduce((acc, x) => {
            if (!acc[x[field].title]) {
                acc[x[field].title] = 0;
            }
            acc[x[field].title] += x.prediction;
            return acc;
        }, {})

        return Object.keys(map).map(key => [key, map[key]]);
    };

    const quantityByAnimalSpecies = filterByField('animalSpecies');
    const quantityByFeedSegment = filterByField('feedSegment');
    const quantityByFeedTitle = filterByField('feedTitle');

    return <>
        <Typography variant="h4" component="div">
            Рекомендації виробництва на наступний місяць
        </Typography>
        <Grid container columnSpacing={{xs: 1, sm: 2, md: 3}}>
            <Tabs
                value={componentIndex}
                onChange={handleChange}
                aria-label="basic tabs example"
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label="10% продаж"/>
                <Tab label="33% продаж"/>
                <Tab label="50% продаж"/>
            </Tabs>
        </Grid>

        <Grid>
            <h4>Аби покрити {percentsMap[componentIndex] * 100}% усіх продаж в наступному місяці</h4>
            <h4>Необхідно створити мінімум {quantityByAnimalSpecies.reduce((acc, x) => acc + x[1], 0)} одиниць корму, серед яких:</h4>
            <Grid container columnSpacing={{xs: 1, sm: 2, md: 3}}>
                <Grid>
                    <ul>
                        {quantityByAnimalSpecies.map(([title, quantity]) => <li>{quantity} одиниць корму для: {title}</li>)}
                    </ul>
                </Grid>
                <Grid>
                    <ul>
                        {quantityByFeedSegment.map(([title, quantity]) => <li>{quantity} одиниць корму: {title}</li>)}
                    </ul>
                </Grid>
                <Grid>
                    <ul>
                        {quantityByFeedTitle.map(([title, quantity]) => <li>{quantity} одиниць {title}</li>)}
                    </ul>
                </Grid>
            </Grid>
            <h4>Детальніший план виробництва наведений нижче</h4>
        </Grid>

        <Grid>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Сегмент корму</TableCell>
                            <TableCell align="right">Назва корму</TableCell>
                            <TableCell align="right">Тваринка</TableCell>
                            <TableCell align="right">Область</TableCell>
                            <TableCell align="right">Кількість продаж</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataToShow.map((row) => (
                            <TableRow
                                key={
                                    'table row ' + [row.feedSegment.id,
                                        row.feedTitle.id,
                                        row.animalSpecies.id,
                                        row.ukraineRegion.id].join('_')}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">{row.feedSegment.title}</TableCell>
                                <TableCell align="right">{row.feedTitle.title}</TableCell>
                                <TableCell align="right">{row.animalSpecies.title}</TableCell>
                                <TableCell align="right">{row.ukraineRegion.title}</TableCell>
                                <TableCell align="right">{row.prediction}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>

    </>
}

export default OverallSalesPredictions;