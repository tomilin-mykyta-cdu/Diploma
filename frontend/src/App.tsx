import React, {useMemo} from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import ChartsPage from "./pages/ChartsPage";
import {AppBar, Toolbar, Typography, Link as MuiLink} from '@mui/material';
import DatabasePage from "./pages/DatabasePage";
import PredictionsPage from "./pages/PredictionsPage";
import useAnimalSpeciesHook from "./hooks/useAnimalSpeciesHook";
import useFeedSegment from "./hooks/useFeedSegment";
import useUkraineRegion from "./hooks/useUkraineRegion";
import useFeedTitles from "./hooks/useFeedTitle";
import { ChartDataContext } from './utils/context';

function App() {
    const animalSpecies = useAnimalSpeciesHook();
    const feedSegments = useFeedSegment();
    const ukraineRegions = useUkraineRegion();
    const feedTitles = useFeedTitles();

    const sharedProps = useMemo(() => ({
        animalSpecies,
        feedSegments,
        ukraineRegions,
        feedTitles,
    }), [animalSpecies, feedSegments, ukraineRegions, feedTitles]);

    const isLoading = !animalSpecies.length || !feedSegments.length || !ukraineRegions.length || !feedTitles.length;

    if (isLoading) {
        return <>Main is loading</>
    }


    return (
        <ChartDataContext.Provider value={{sharedProps}} key={'data_context'}>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" sx={{flexGrow: 1}}>
                            СППР
                        </Typography>
                        <MuiLink href="/" color="inherit" underline="none"
                                 sx={{marginRight: 2}}>Презентація</MuiLink>
                        <MuiLink href="/charts" color="inherit" underline="none"
                                 sx={{marginRight: 2}}>Діаграми</MuiLink>
                        <MuiLink href="/database" color="inherit" underline="none" sx={{marginRight: 2}}>Дані</MuiLink>
                        <MuiLink href="/predictions" color="inherit" underline="none"
                                 sx={{marginRight: 2}}>Аналітика</MuiLink>
                    </Toolbar>
                </AppBar>

                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/charts" element={<ChartsPage/>}/>
                    <Route path="/database" element={<DatabasePage/>}/>
                    <Route path="/predictions" element={<PredictionsPage/>}/>
                </Routes>
            </div>
        </ChartDataContext.Provider>
    );
}

export default App;
