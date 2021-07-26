import type {
  DefaultLoadParams,
} from 'react-redux-isomorphic';
import type {
  // eslint-disable-next-line import/no-named-default
  default as Filterlist,
  ItemsLoaderResponse,
  ListState,
} from '@vtaits/filterlist';
import type {
  Params as FilterlistParams,
} from '@vtaits/react-filterlist';

export type ItemsLoader<
Item,
Additional,
Error,
LoadParams = DefaultLoadParams,
> = (
  loadParams: LoadParams,
  prevListState: ListState<Item, Additional, Error>,
) => ItemsLoaderResponse<Item, Additional> | Promise<ItemsLoaderResponse<Item, Additional>>;

export type Params<
Item,
Additional,
Error,
FiltersAndSortData,
LoadParams = DefaultLoadParams,
> =
  & Omit<FilterlistParams<Item, Additional, Error, FiltersAndSortData>, 'loadItems'>
  & {
    loadItems: ItemsLoader<Item, Additional, Error, LoadParams>;
  };

export type IsomorphicErrorType<ErrorType, Additional> = {
  error?: ErrorType;
  additional?: Additional;
};

export type UseFilterlistIsomorphicReturn<Item, Additional, ErrorType> = [
  ListState<Item, Additional, ErrorType>,
  Filterlist<Item, Additional, ErrorType>,
];
