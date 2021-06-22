import { useMemo, useRef } from 'react';
import {
  useIsomorphic,
  useLoadParams,
  LoadContextError as IsomorphicError,
} from 'react-redux-isomorphic';
import Filterlist, {
  collectListInitialState,
  collectOptions,
  LoadListError as FilterlistError,
} from '@vtaits/filterlist';
import type {
  ListState,
  ItemsLoaderResponse,
} from '@vtaits/filterlist';
import {
  useFilterlist,
} from '@vtaits/react-filterlist';
import type {
  Params as FilterlistParams,
} from '@vtaits/react-filterlist';

import {
  LoadListError,
} from './errors';

import type {
  Params,
} from './types';

export const useFilterlistIsomorphic = <
LoadParams,
Item,
Additional,
ErrorType,
FiltersAndSortData,
>(
    isomorphicId: string,
    listParams: Params<LoadParams, Item, Additional, ErrorType, FiltersAndSortData>,
  ): [ListState<Item, Additional, ErrorType>, Filterlist<Item, Additional, ErrorType>] => {
  const isomorphicResponseRef = useRef(null);

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

  const isomorphicResponse = useIsomorphic(isomorphicId, async () => {
    if (!listOptions.autoload) {
      return null;
    }

    const {
      parseFiltersAndSort = null,
      filtersAndSortData = null,
    } = listParams;

    let parsedState;

    if (parseFiltersAndSort) {
      parsedState = await parseFiltersAndSort(filtersAndSortData);
    } else {
      parsedState = {};
    }

    let response;
    let cathcedError;
    let hasError;

    try {
      response = await listParams.loadItems(
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

  const filterlistParams = useMemo(() => ({
    ...listParams,

    loadItems: async (currentListState) => {
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
  }), [isomorphicId, listParams.filtersAndSortData]);

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
