type BaseClass = {
    id: number;
    createdAt: number;
}

export type UkraineRegion = BaseClass & { title: string; };
export type AnimalSpecies = BaseClass & { title: string; };
export type FeedSegment = BaseClass & {title: string; };
export type Feed = BaseClass & { title: string; animalSpecies: AnimalSpecies[]; feedSegment: FeedSegment[] };
export type Production = BaseClass & { feed: Feed[]; }
export type MarketDemand = BaseClass & { createdAt: string; production: Production[], ukraineRegion: UkraineRegion };

export type Provider = BaseClass & {
    title: string;
};
export type Ingredient = BaseClass & { title: string; };
export type IngredientQuality = BaseClass & { ingredient: Ingredient[]; provider: Provider[]; feedSegment: FeedSegment[] };
export type FeedReceipt = BaseClass & { feed: Feed[]; ingredients: Ingredient[] };