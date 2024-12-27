import {createContext, useContext} from "react";

export const ChartDataContext = createContext<any>(null);
export const useChartData = () => useContext(ChartDataContext);