import React from "react";
import {DatabaseVocabulary} from "../../vocabulary/databaseData";
import NewDatabaseAbstract from "./Base";

type Props = {
    index: number;
    handleClose: () => void;
}

const NewDatabase: React.FC<Props> = (props: Props) => {
    // console.log(`Rendering NewDatabase`);
    const componentsVocabulary = [
        DatabaseVocabulary.NewAnimalSpecies,
        DatabaseVocabulary.NewFeed,
        DatabaseVocabulary.NewFeedSegment,
        DatabaseVocabulary.NewUkraineRegion,
        DatabaseVocabulary.NewIngredient,
        DatabaseVocabulary.NewProduction,
        DatabaseVocabulary.NewFeedReceipt,

        // DatabaseVocabulary.NewIngredientQuality,
        // DatabaseVocabulary.NewMarketDemand,
        // DatabaseVocabulary.NewProvider,
    ];

    return <>
        <NewDatabaseAbstract vocabulary={componentsVocabulary[props.index]} handleClose={props.handleClose}/>
    </>
}

export default NewDatabase;
