// https://mui.com/x/react-charts/pie/
import React from "react";
import {
    Domain,
    VariableDate,
    VariableQuery,
} from "../../../vocabulary/predictions";
import OverallSalesPredictions from "../../Analitics/OverallSalesPredictions";
import CertainSalesPredictions from "../../Analitics/CertainSalesPredictions";

type Props = {
    entity: any;
    vocabulary: Domain;

    onRemoveChart: () => void;
}

export type VariableQueryWithData = VariableQuery & { data: any };
export type FinalVariable = VariableQueryWithData | VariableDate;

const PredictionsChart: React.FC<Props> = React.memo((props: Props) => {
    const vocabularyData = props.vocabulary;


    return <>
        <OverallSalesPredictions entity={props.entity} vocabulary={vocabularyData}/>
        <CertainSalesPredictions />
    </>
});

export default PredictionsChart;
