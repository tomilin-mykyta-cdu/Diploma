export const domainTranslation: Record<string, string> = {
    MarketDemand: 'Продажі',
    marketDemand: 'Продажі',
    Productions: 'Виробництво',
    productions: 'Виробництво',
    AnimalSpecies: 'Тварини',
    animalSpecies: 'Тварини',
    FeedReceipt: 'Рецепти',
    feedReceipt: 'Рецепти',
    FeedSegment: 'Сегменти',
    feedSegment: 'Сегменти',
    FeedTitle: 'Назва корму',
    feedTitle: 'Назва корму',
    Ingredient: 'Інгредієнти',
    ingredient: 'Інгредієнти',
    IngredientQuality: 'Якість інгредієнтів',
    ingredientQuality: 'Якість інгредієнтів',
    Provider: 'Провайдер',
    provider: 'Провайдер',
    UkraineRegion: 'Області',
    ukraineRegion: 'Області',
    feed: 'Назва корму',
    Feed: 'Назва корму',
};

export const getDomainTranslate = (key: string): string => {
    return domainTranslation[key] ?? key;
};
