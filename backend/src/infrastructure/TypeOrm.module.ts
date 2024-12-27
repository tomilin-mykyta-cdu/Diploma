import { DataSource } from 'typeorm';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { AnimalSpeciesEntity } from '../modules/AnimalSpecies/AnimalSpecies.entity';
import { FeedEntity } from '../modules/feed/Feed.entity';
import { FeedReceiptEntity } from '../modules/feedReceipt/FeedReceipt.entity';
import { FeedSegmentEntity } from '../modules/feedSegment/FeedSegment.entity';
import { IngredientEntity } from '../modules/ingredient/Ingredient.entity';
import { IngredientQualityEntity } from '../modules/ingredientQuality/IngredientQuality.entity';
import { MarketDemandEntity } from '../modules/marketDemand/MarketDemand.entity';
import { ProductionEntity } from '../modules/production/Production.entity';
import { ProviderEntity } from '../modules/provider/Provider.entity';
import { UkraineRegionEntity } from '../modules/ukraineRegion/UkraineRegion.entity';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { FeedTitleEntity } from '../modules/feedTitles/FeedTitle.entity';
import { PresentationController } from '../presentation/Presentation.controller';

@Global()
@Module({})
export class TypeOrmModule {
  static forFeature(entities: any[]): DynamicModule {
    return {
      module: TypeOrmModule,
      imports: [
        NestTypeOrmModule.forFeature(entities),
      ],
      exports: [NestTypeOrmModule],
    };
  }

  static forRoot(): DynamicModule {
    return {
      module: TypeOrmModule,
      imports: [
        NestTypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const dataSource = new DataSource({
              type: 'postgres',
              host: 'localhost',
              port: configService.get<number>('DATABASE_PORT'),
              username: configService.get<string>('DATABASE_USER'),
              password: configService.get<string>('DATABASE_PASSWORD'),
              database: configService.get<string>('DATABASE'),
              synchronize: true,
              entities: [
                AnimalSpeciesEntity,
                FeedEntity,
                FeedTitleEntity,
                FeedReceiptEntity,
                FeedSegmentEntity,
                IngredientEntity,
                IngredientQualityEntity,
                MarketDemandEntity,
                ProductionEntity,
                ProviderEntity,
                UkraineRegionEntity,
              ],
            });

            try {
              await dataSource.initialize();
              console.log('Database connected successfully');
            } catch (error) {
              console.log('Error connecting to database');
              console.log(error);
              throw error;
            }

            if (configService.get<string>('FILL_DATABASE') !== 'true') {
              initializePresentationObject();

              return dataSource.options;
            }

            try {
              await Promise.all([
                createAnimalType(dataSource, INITIAL_VALUES.ANIMAL_TYPES),
                createFeedSegment(dataSource, INITIAL_VALUES.FEED_SEGMENTS),
                createProvider(dataSource, INITIAL_VALUES.PROVIDERS),
                createUkraineRegion(dataSource, INITIAL_VALUES.UKRAINE_REGIONS),
                createIngridients(dataSource, INITIAL_VALUES.INGRIDIENTS),
                createFeedTitles(dataSource, INITIAL_VALUES.FEED_ENTITIES),
              ]);
            } catch (error) {
              console.log('Error filling DB with defaults values');
              throw error;
            }

            initializePresentationObject();

            try {
              await Promise.all([
                createFeed(dataSource, INITIAL_VALUES.ANIMAL_TYPES, INITIAL_VALUES.FEED_SEGMENTS, INITIAL_VALUES.FEED_ENTITIES),
                // createFeedReceipts(
                //   dataSource,
                //   INITIAL_VALUES.ANIMAL_TYPES.length * INITIAL_VALUES.FEED_SEGMENTS.length * INITIAL_VALUES.FEED_ENTITIES.length,
                //   INITIAL_VALUES.INGRIDIENTS.length,
                // ),
                // createIngridientQuality(
                //   dataSource,
                //   INITIAL_VALUES.INGRIDIENTS.length,
                //   INITIAL_VALUES.PROVIDERS.length,
                //   INITIAL_VALUES.FEED_SEGMENTS.length,
                // ),
              ]);

            } catch (error) {
              console.log('Error filling DB with 1 wave values');
              throw error;
            }

            try {
              await Promise.all([
                createProduction(dataSource),
              ]);

              return dataSource.options;
            } catch (error) {
              console.log('Error filling DB with 2 wave values');
              throw error;
            }
          },
        }),
      ],
      exports: [NestTypeOrmModule],
    };
  }
}


export async function createAnimalType(dataSource: DataSource, values: string[]) {
  return dataSource
    .createQueryBuilder()
    .insert()
    .into(AnimalSpeciesEntity)
    .values(values.map((title) => ({ title })))
    .orIgnore()
    .execute();
}

export async function createFeedSegment(dataSource: DataSource, values: string[]) {
  return dataSource
    .createQueryBuilder()
    .insert()
    .into(FeedSegmentEntity)
    .values(values.map((title) => ({ title })))
    .orIgnore()
    .execute();
}

export async function createProvider(dataSource: DataSource, values: string[]) {
  return dataSource
    .createQueryBuilder()
    .insert()
    .into(ProviderEntity)
    .values(values.map((title) => ({ title })))
    .orIgnore()
    .execute();
}

export async function createUkraineRegion(dataSource: DataSource, values: string[]) {
  return dataSource
    .createQueryBuilder()
    .insert()
    .into(UkraineRegionEntity)
    .values(values.map((title) => ({ title })))
    .orIgnore()
    .execute();
}

export async function createIngridients(dataSource: DataSource, values: string[]) {
  return dataSource
    .createQueryBuilder()
    .insert()
    .into(IngredientEntity)
    .values(values.map((title) => ({ title })))
    .orIgnore()
    .execute();
}

export async function createFeed(
  dataSource: DataSource,
  animalTypes: string[],
  feedSegments: string[],
  feedTitles: string[],
) {
  const values = [];
  for (let animalTypeIndex = 1; animalTypeIndex <= animalTypes.length; animalTypeIndex += 1) {
    for (let feedSegmentIndex = 1; feedSegmentIndex <= feedSegments.length; feedSegmentIndex += 1) {
      for (let titleIndex = 1; titleIndex <= feedTitles.length; titleIndex += 1) {
        values.push({
          feedTitle: titleIndex,
          animalSpecies: animalTypeIndex,
          feedSegment: feedSegmentIndex,
        });
      }
    }
  }

  return dataSource
    .createQueryBuilder()
    .insert()
    .into(FeedEntity)
    .values(values)
    .orIgnore()
    .execute();
}

export async function createFeedTitles(
  dataSource: DataSource,
  values: string[],
) {
  return dataSource
    .createQueryBuilder()
    .insert()
    .into(FeedTitleEntity)
    .values(values.map((title) => ({ title })))
    .orIgnore()
    .execute();
}

export async function createFeedReceipts(
  dataSource: DataSource,
  feedsAmount: number,
  ingridientsAmount: number,
) {
  const values = [];
  for (let feedIndex = 1; feedIndex <= feedsAmount; feedIndex += 1) {
    const nIngredients = getIntegerBetween(3, ingridientsAmount - 3); // no receipts with less than 3 ingridients

    const ingredientIndices = new Set();
    do {
      const r = getIntegerBetween(1, ingridientsAmount);
      ingredientIndices.add(r);
    } while(ingredientIndices.size < nIngredients);

    values.push(...Array.from(ingredientIndices).map(i => ({
      feed: feedIndex,
      ingredient: i,
    })));
  }

  return dataSource
    .createQueryBuilder()
    .insert()
    .into(FeedReceiptEntity)
    .values(values)
    .orIgnore()
    .execute();
}

export async function createIngridientQuality(
  dataSource: DataSource,
  ingridientsAmount: number,
  providersAmount: number,
  feedSegmentsAmount: number,
) {
  const values = [];

  for (let ingridientIndex = 1; ingridientIndex <= ingridientsAmount; ingridientIndex +=1 ) {
    for (let providerIndex = 1; providerIndex <= providersAmount; providerIndex += 1) {
      for (let feedSegmentIndex = 1; feedSegmentIndex <= feedSegmentsAmount; feedSegmentIndex += 1) {
        // Increase the price for higher quality ingridient
        const price = (getIntegerBetween(10, 30) + (feedSegmentIndex * 20)) * 100;
        values.push({
          ingridient: ingridientIndex,
          provider: providerIndex,
          quality: feedSegmentIndex,
          price,
        });
      }
    }
  }

  return dataSource
    .createQueryBuilder()
    .insert()
    .into(IngredientQualityEntity)
    .values(values)
    .orIgnore()
    .execute();
}

export async function createProduction(dataSource: DataSource) {
  const feed = await dataSource
    .getRepository(FeedEntity)
    .createQueryBuilder()
    .getMany();

  const values = feed.map((feed) => ({
    feed: feed,
    amount: getIntegerBetween(1_000, 10_000),
  }));

  return dataSource
    .createQueryBuilder()
    .insert()
    .into(ProductionEntity)
    .values(values)
    .orIgnore()
    .execute();
}

const INITIAL_VALUES = {
  ANIMAL_TYPES: ['Собака', 'Кіт'/*, 'Папуга', 'Ховрах', 'Заєць'*/],
  FEED_SEGMENTS: ['Еко', 'Преміум', 'Супер преміум', /*'Холістик'*/],
  PROVIDERS: [
    'Львівський комбінат',
    'Київський комбінат',
    'Дніпровський комбінат',
  ],
  FEED_ENTITIES: [
    'Gourmet',
    'Savory',
    'Half&Half',
    /*'Purina',
    'Cat Chow',
    'Advocate'*/
  ],
  INGRIDIENTS: [
    'Морква',
    'Телятина',
    'Кроль',
    'Індичка',
    'Соя',
    'Курка',
    'Лосось',
    'Желе',
    'Кукурудза',
    'Горох',
    'Цикорій',
  ],
  UKRAINE_REGIONS: [
    'Вінницька область',
    'Волинська область',
    'Дніпропетровська область',
    'Донецька область',
    'Житомирська область',
    'Закарпатська область',
    'Запорізька область',
    'Івано-Франківська область',
    'Київська область',
    /*'Кіровоградська область',
    'Луганська область',
    'Львівська область',
    'Миколаївська область',
    'Одеська область',
    'Полтавська область',
    'Рівненська область',
    'Сумська область',
    'Тернопільська область',
    'Харківська область',
    'Херсонська область',
    'Хмельницька область',
    'Черкаська область',
    'Чернівецька область',
    'Чернігівська область',
    'АР Крим',*/
  ],
};

export const getIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min) + min);

function initializePresentationObject() {
  PresentationController.initPresentationObject('animalSpecies', INITIAL_VALUES.ANIMAL_TYPES);
  PresentationController.initPresentationObject('feedSegment', INITIAL_VALUES.FEED_SEGMENTS);
  PresentationController.initPresentationObject('ukraineRegion', INITIAL_VALUES.UKRAINE_REGIONS);
  PresentationController.initPresentationObject('feedTitle', INITIAL_VALUES.FEED_ENTITIES);
}