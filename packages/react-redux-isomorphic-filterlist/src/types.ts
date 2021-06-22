import type {
  ItemsLoaderResponse,
  ListState,
} from '@vtaits/filterlist';
import type {
  Params as FilterlistParams,
} from '@vtaits/react-filterlist';

export type ItemsLoader<
LoadParams,
Item,
Additional,
Error,
> = (
  loadParams: LoadParams,
  prevListState: ListState<Item, Additional, Error>,
) => ItemsLoaderResponse<Item, Additional> | Promise<ItemsLoaderResponse<Item, Additional>>;

export type Params<
LoadParams,
Item,
Additional,
Error,
FiltersAndSortData,
> =
  & Omit<FilterlistParams<Item, Additional, Error, FiltersAndSortData>, 'loadItems'>
  & {
    loadItems: ItemsLoader<LoadParams, Item, Additional, Error>;
  };
