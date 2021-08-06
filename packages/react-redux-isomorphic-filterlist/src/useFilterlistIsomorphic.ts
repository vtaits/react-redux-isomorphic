import {
  useMemo as useMemoBase,
  useRef as useRefBase,
} from 'react';
import {
  useIsomorphic as useIsomorphicBase,
  useLoadParams as useLoadParamsBase,
  LoadContextError as IsomorphicError,
} from 'react-redux-isomorphic';
import type {
  DefaultLoadParams,
  UseIsomorphicResult,
} from 'react-redux-isomorphic';
import {
  collectListInitialState as collectListInitialStateBase,
  collectOptions as collectOptionsBase,
  LoadListError as FilterlistError,
} from '@vtaits/filterlist';
import type {
  ListState,
  ItemsLoaderResponse,
} from '@vtaits/filterlist';
import {
  useFilterlist as useFilterlistBase,
} from '@vtaits/react-filterlist';
import type {
  Params as FilterlistParams,
  ParsedFiltersAndSort,
} from '@vtaits/react-filterlist';

import {
  LoadListError,
} from './errors';

import type {
  IsomorphicErrorType,
  Params,
  UseFilterlistIsomorphicReturn,
} from './types';

export const useFilterlistIsomorphicPure = <
Item,
Additional,
ErrorType,
FiltersAndSortData,
LoadParams = DefaultLoadParams,
>(
    isomorphicId: string,
    listParams: Params<Item, Additional, ErrorType, FiltersAndSortData, LoadParams>,
    useIsomorphic: typeof useIsomorphicBase,
    useLoadParams: typeof useLoadParamsBase,
    collectListInitialState: typeof collectListInitialStateBase,
    collectOptions: typeof collectOptionsBase,
    useFilterlist: typeof useFilterlistBase,
    useRef: typeof useRefBase,
    useMemo: typeof useMemoBase,
  ): UseFilterlistIsomorphicReturn<Item, Additional, ErrorType> => {
  const isomorphicResponseRef = useRef<UseIsomorphicResult<
  ItemsLoaderResponse<Item, Additional>,
  IsomorphicErrorType<ErrorType, Additional>
  >>(null);

  const listOptions = useMemo(
    () => collectOptions(
      listParams as unknown as FilterlistParams<Item, Additional, ErrorType, FiltersAndSortData>,
    ),
    [isomorphicId],
  );
  const listInitialState = useMemo(
    () => collectListInitialState(
      listParams as unknown as FilterlistParams<Item, Additional, ErrorType, FiltersAndSortData>,
    ),
    [isomorphicId],
  );

  const isomorphicParams = useLoadParams<LoadParams>();

  const isomorphicResponse = useIsomorphic<
  ItemsLoaderResponse<Item, Additional>,
  IsomorphicErrorType<ErrorType, Additional>,
  LoadParams
  >(isomorphicId, async () => {
    if (!listOptions.autoload) {
      return null;
    }

    const {
      loadItems,
      parseFiltersAndSort = null,
      filtersAndSortData = null,
    } = listParams;

    let parsedState: Partial<ParsedFiltersAndSort>;

    if (parseFiltersAndSort) {
      parsedState = await parseFiltersAndSort(filtersAndSortData);
    } else {
      parsedState = {};
    }

    let response: ItemsLoaderResponse<Item, Additional>;
    let cathcedError: LoadListError<ErrorType, Additional> | Error;
    let hasError: boolean;

    try {
      response = await loadItems(
        isomorphicParams,
        {
          ...listInitialState,
          ...parsedState,
        },
      );

      hasError = false;
    } catch (e) {
      cathcedError = e;
      hasError = true;
    }

    if (hasError) {
      if (cathcedError instanceof LoadListError) {
        throw new IsomorphicError({
          error: cathcedError.error,
          additional: cathcedError.additional,
        });
      }

      throw cathcedError;
    }

    return response;
  });

  isomorphicResponseRef.current = isomorphicResponse;

  const filterlistParams = useMemo(
    (): FilterlistParams<Item, Additional, ErrorType, FiltersAndSortData> => ({
      ...listParams,

      loadItems: async (currentListState: ListState<Item, Additional, ErrorType>) => {
        const {
          isReady,
          context: isomorphicContext,
          error,
        } = isomorphicResponseRef.current;

        if (!isReady) {
          return {
            items: [],
            additional: listInitialState.additional,
          };
        }

        if (currentListState.isFirstLoad) {
          if (error) {
            throw new FilterlistError(error);
          }

          return isomorphicContext;
        }

        let response: ItemsLoaderResponse<Item, Additional>;
        let cathcedError: LoadListError<ErrorType, Additional> | Error;
        let hasError: boolean;

        try {
          response = await listParams.loadItems(
            isomorphicParams,
            currentListState,
          );

          hasError = false;
        } catch (e) {
          cathcedError = e;
          hasError = true;
        }

        if (hasError) {
          if (cathcedError instanceof LoadListError) {
            throw new FilterlistError({
              error: cathcedError.error,
              additional: cathcedError.additional,
            });
          }

          throw cathcedError;
        }

        return response;
      },
    }),

    [
      isomorphicId,
      listParams.filtersAndSortData,
      listParams.canInit,
    ],
  );

  const {
    isReady,
    context: isomorphicContext,
  } = isomorphicResponse;

  const [
    listState,
    filterlist,
  ] = useFilterlist(filterlistParams, [isomorphicId, isReady]);

  if (isReady) {
    if (listState.isFirstLoad) {
      return [
        {
          ...listInitialState,
          ...isomorphicContext,
        },
        filterlist,
      ];
    }

    return [listState, filterlist];
  }

  return [listInitialState, filterlist];
};

export const useFilterlistIsomorphic = <
Item,
Additional,
ErrorType,
FiltersAndSortData,
LoadParams = DefaultLoadParams,
>(
    isomorphicId: string,
    listParams: Params<Item, Additional, ErrorType, FiltersAndSortData, LoadParams>,
  ): UseFilterlistIsomorphicReturn<Item, Additional, ErrorType> => useFilterlistIsomorphicPure(
    isomorphicId,
    listParams,
    useIsomorphicBase,
    useLoadParamsBase,
    collectListInitialStateBase,
    collectOptionsBase,
    useFilterlistBase,
    useRefBase,
    useMemoBase,
  );
