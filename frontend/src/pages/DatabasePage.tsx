import React from 'react';
import AnimalSpeciesList from "../components/Database/AnimalSpeciesList";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import FeedList from "../components/Database/FeedList";
import FeedReceiptList from "../components/Database/FeedReceiptList";
import FeedSegmentList from "../components/Database/FeedSegmentList";
import IngredientList from "../components/Database/IngredientList";
import ProviderList from "../components/Database/ProviderList";
import UkraineRegionList from "../components/Database/UkraineRegionList";
import NewDatabase from "../components/NewDatabase";

const DatabasePage: React.FC = () => {
    const components = [
        () => <AnimalSpeciesList/>,
        () => <FeedList/>,
        () => <FeedSegmentList/>,
        () => <UkraineRegionList/>,
        // () => <IngredientList/>,
        // () => <ProviderList/>,
        // () => <FeedReceiptList/>,
        // () => <IngredientQualityList/>,
        // () => <MarketDemandList/>,
        // () => <ProductionList/>,
    ];

    const [componentIndex, setComponentIndex] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setComponentIndex(newValue);
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return <>
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={componentIndex}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Види тваринок" />
                    <Tab label="Корми" />
                    <Tab label="Сегменти" />
                    <Tab label="Області" />
                    {/*<Tab label="Інгредієнти" />*/}
                    {/*<Tab label="Постачальники" />*/}
                    {/*<Tab label="Рецепт" />*/}

                    {/*<Tab label="Інгредієнти постачальників" />*/}

                    {/*<Tab label="Продажі" />*/}
                    {/*<Tab label="Виробництво" />*/}
                </Tabs>
            </Box>
            {
                components.map((item, index) => <>
                    <CustomTabPanel key={`database-tab-${index}`} value={componentIndex} index={index}>
                        { item() }
                    </CustomTabPanel>
                </>)
            }
            <Button onClick={handleOpen}>Створити</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                </DialogTitle>
                <DialogContent>
                    <NewDatabase index={componentIndex} handleClose={handleClose} />
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
        </Box>
    </>
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default DatabasePage;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
