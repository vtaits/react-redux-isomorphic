import {
  useMemo as useMemoBase,
  useRef as useRefBase,
} from 'react';
import {
  useIsomorphic as useIsomorphicBase,
  useLoadParams as useLoadParamsBase,
  LoadContextError as IsomorphicError,
} from 'react-redux-isomorphic';
import {
  collectListInitialState as collectListInitialStateBase,
  collectOptions as collectOptionsBase,
  LoadListError as FilterlistError,
} from '@vtaits/filterlist';

import {
  useFilterlist as useFilterlistBase,
} from '@vtaits/react-filterlist';
import type {
  ParsedFiltersAndSort,
} from '@vtaits/react-filterlist';

import {
  useFilterlistIsomorphicPure,
} from '../useFilterlistIsomorphic';

import {
  LoadListError,
} from '../errors';

import type {
  IsomorphicErrorType,
  Params,
} from '../types';

const defaultParams: Params<any, any, any, any, any> = {
  loadItems: () => ({
    items: [],
  }),
};

const defaultUseIsomorphicResponse = {
  context: null,
  error: null,
  isLoading: false,
  isReady: false,
  isReloading: false,
  reload: () => {},
};

const useIsomorphicMock: typeof useIsomorphicBase = () => ({
  context: null,
  error: null,
  isLoading: false,
  isReady: false,
  isReloading: false,
  reload: () => {},
});

const isomorphicParams = {
  testParam: 'testValue',
};

const useLoadParamsMock: typeof useLoadParamsBase = () => isomorphicParams as any;

const defaultInitialState = {
  sort: {
    asc: false,
    param: null,
  },
  filters: {},
  appliedFilters: {},
  loading: false,
  error: null,
  additional: null,
  isFirstLoad: false,
  items: [],
  shouldClean: false,
};

const collectListInitialStateMock: typeof collectListInitialStateBase = () => defaultInitialState;

const defaultOptions = {
  alwaysResetFilters: {},
  autoload: true,
  isDefaultSortAsc: false,
  resetFiltersTo: {},
  saveFiltersOnResetAll: [],
  saveItemsWhileLoad: false,
};

const collectOptionsMock: typeof collectOptionsBase = () => defaultOptions;

const useFilterlistMock: typeof useFilterlistBase = () => [
  defaultInitialState,
  null,
];

const useMemoMock: typeof useMemoBase = (cb) => cb();

const useRefMock: typeof useRefBase = () => ({
  current: null,
});

describe('precount params', () => {
  test('should call `collectOptions` with all params', () => {
    const collectOptions = jest.fn();

    useFilterlistIsomorphicPure(
      'testId',
      defaultParams,
      useIsomorphicMock,
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptions,
      useFilterlistMock,
      useRefMock,
      useMemoMock,
    );

    expect(collectOptions).toHaveBeenCalledTimes(1);
    expect(collectOptions).toHaveBeenCalledWith(defaultParams);
  });

  test('should call `collectListInitialState` with all params', () => {
    const collectListInitialState = jest.fn();

    useFilterlistIsomorphicPure(
      'testId',
      defaultParams,
      useIsomorphicMock,
      useLoadParamsMock,
      collectListInitialState,
      collectOptionsMock,
      useFilterlistMock,
      useRefMock,
      useMemoMock,
    );

    expect(collectListInitialState).toHaveBeenCalledTimes(1);
    expect(collectListInitialState).toHaveBeenCalledWith(defaultParams);
  });
});

describe('useIsomorphic', () => {
  test('should not call `parseFiltersAndSort` and `loadItems` if `autoload` is falsy', async () => {
    const parseFiltersAndSort = jest.fn();
    const loadItems = jest.fn();
    const useIsomorphic = jest.fn<
    ReturnType<typeof useIsomorphicBase>,
    Parameters<typeof useIsomorphicBase>
    >()
      .mockReturnValue(defaultUseIsomorphicResponse);

    useFilterlistIsomorphicPure(
      'testId',
      {
        ...defaultParams,
        parseFiltersAndSort,
        loadItems,
      },
      useIsomorphic as typeof useIsomorphicBase,
      useLoadParamsMock,
      collectListInitialStateMock,
      () => ({
        ...defaultOptions,
        autoload: false,
      }),
      useFilterlistMock,
      useRefMock,
      useMemoMock,
    );

    expect(useIsomorphic).toHaveBeenCalledTimes(1);
    const response = await useIsomorphic.mock.calls[0][1]({});

    expect(response).toBe(null);
    expect(parseFiltersAndSort).toHaveBeenCalledTimes(0);
    expect(loadItems).toHaveBeenCalledTimes(0);
  });

  test('should call `loadItems` with initial state', async () => {
    const loadItems = jest.fn();
    const useIsomorphic = jest.fn<
    ReturnType<typeof useIsomorphicBase>,
    Parameters<typeof useIsomorphicBase>
    >()
      .mockReturnValue(defaultUseIsomorphicResponse);

    useFilterlistIsomorphicPure(
      'testId',
      {
        ...defaultParams,
        loadItems,
      },
      useIsomorphic as typeof useIsomorphicBase,
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      useFilterlistMock,
      useRefMock,
      useMemoMock,
    );

    expect(useIsomorphic).toHaveBeenCalledTimes(1);
    await useIsomorphic.mock.calls[0][1](isomorphicParams);

    expect(loadItems).toHaveBeenCalledTimes(1);
    expect(loadItems).toHaveBeenCalledWith(
      isomorphicParams,
      defaultInitialState,
    );
  });

  test('should call `loadItems` with parsed params', async () => {
    const loadItems = jest.fn();
    const parseFiltersAndSort = jest.fn<ParsedFiltersAndSort, [any]>()
      .mockReturnValue({
        appliedFilters: {
          filter1: 'value1',
        },

        filters: {
          filter2: 'value2',
        },

        sort: {
          param: 'test',
          asc: true,
        },
      });
    const useIsomorphic = jest.fn<
    ReturnType<typeof useIsomorphicBase>,
    Parameters<typeof useIsomorphicBase>
    >()
      .mockReturnValue(defaultUseIsomorphicResponse);

    const filtersAndSortData = Symbol('filters and sort data');

    useFilterlistIsomorphicPure(
      'testId',
      {
        ...defaultParams,
        filtersAndSortData,
        loadItems,
        parseFiltersAndSort,
      },
      useIsomorphic as typeof useIsomorphicBase,
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      useFilterlistMock,
      useRefMock,
      useMemoMock,
    );

    expect(useIsomorphic).toHaveBeenCalledTimes(1);
    await useIsomorphic.mock.calls[0][1](isomorphicParams);

    expect(parseFiltersAndSort).toHaveBeenCalledTimes(1);
    expect(parseFiltersAndSort).toHaveBeenCalledWith(filtersAndSortData);

    expect(loadItems).toHaveBeenCalledTimes(1);
    expect(loadItems).toHaveBeenCalledWith(
      isomorphicParams,
      {
        ...defaultInitialState,

        appliedFilters: {
          filter1: 'value1',
        },

        filters: {
          filter2: 'value2',
        },

        sort: {
          param: 'test',
          asc: true,
        },
      },
    );
  });

  test('should support LoadListError in `loadItems`', async () => {
    const loadItems = jest.fn()
      .mockRejectedValue(new LoadListError({
        error: 'testError',
        additional: 'testAdditional',
      }));

    const useIsomorphic = jest.fn<
    ReturnType<typeof useIsomorphicBase>,
    Parameters<typeof useIsomorphicBase>
    >()
      .mockReturnValue(defaultUseIsomorphicResponse);

    useFilterlistIsomorphicPure(
      'testId',
      {
        ...defaultParams,
        loadItems,
      },
      useIsomorphic as typeof useIsomorphicBase,
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      useFilterlistMock,
      useRefMock,
      useMemoMock,
    );

    expect(useIsomorphic).toHaveBeenCalledTimes(1);

    let catchedError: IsomorphicError<IsomorphicErrorType<any, any>>;

    try {
      await useIsomorphic.mock.calls[0][1](isomorphicParams);
    } catch (e) {
      catchedError = e as IsomorphicError<IsomorphicErrorType<any, any>>;
    }

    expect(catchedError.error).toEqual({
      error: 'testError',
      additional: 'testAdditional',
    });
  });

  test('should throw up error that not implements `LoadListError`', async () => {
    const error = new Error('test error');

    const loadItems = jest.fn()
      .mockRejectedValue(error);

    const useIsomorphic = jest.fn<
    ReturnType<typeof useIsomorphicBase>,
    Parameters<typeof useIsomorphicBase>
    >()
      .mockReturnValue(defaultUseIsomorphicResponse);

    useFilterlistIsomorphicPure(
      'testId',
      {
        ...defaultParams,
        loadItems,
      },
      useIsomorphic as typeof useIsomorphicBase,
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      useFilterlistMock,
      useRefMock,
      useMemoMock,
    );

    expect(useIsomorphic).toHaveBeenCalledTimes(1);

    let catchedError: Error;

    try {
      await useIsomorphic.mock.calls[0][1](isomorphicParams);
    } catch (e) {
      catchedError = e as Error;
    }

    expect(catchedError).toBe(error);
  });
});

describe('useFilterlist', () => {
  test('should provide all params with redefined `loadItems`', () => {
    const useFilterlist = jest.fn<
    ReturnType<typeof useFilterlistBase>,
    Parameters<typeof useFilterlistBase>
    >()
      .mockReturnValue([defaultInitialState, null]);

    useFilterlistIsomorphicPure(
      'testId',
      {
        additional: 'testAdditional',
        appliedFilters: {
          filter1: 'value1',
        },

        loadItems: () => ({
          items: [],
        }),
      },
      useIsomorphicMock,
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      useFilterlist as typeof useFilterlistBase,
      useRefMock,
      useMemoMock,
    );

    const filterlistParams = useFilterlist.mock.calls[0][0];

    expect(filterlistParams.additional).toBe('testAdditional');
    expect(filterlistParams.appliedFilters).toEqual({
      filter1: 'value1',
    });
  });

  test('should return empty items list and initial `additional` if isomorphic is not ready', async () => {
    const useFilterlist = jest.fn<
    ReturnType<typeof useFilterlistBase>,
    Parameters<typeof useFilterlistBase>
    >()
      .mockReturnValue([defaultInitialState, null]);

    useFilterlistIsomorphicPure(
      'testId',
      defaultParams,
      useIsomorphicMock,
      useLoadParamsMock,
      () => ({
        ...defaultInitialState,

        loadItems: () => ({
          items: [1, 2, 3],
        }),

        additional: 'testAdditional' as any,
      }),
      collectOptionsMock,
      useFilterlist as typeof useFilterlistBase,
      useRefMock,
      useMemoMock,
    );

    const result = await useFilterlist.mock.calls[0][0].loadItems(defaultInitialState);

    expect(result).toEqual({
      items: [],
      additional: 'testAdditional',
    });
  });

  test('should return result from `useIsomorphic` for first load', async () => {
    const useFilterlist = jest.fn<
    ReturnType<typeof useFilterlistBase>,
    Parameters<typeof useFilterlistBase>
    >()
      .mockReturnValue([defaultInitialState, null]);

    useFilterlistIsomorphicPure(
      'testId',
      defaultParams,
      () => ({
        ...defaultUseIsomorphicResponse,

        context: {
          items: [4, 5, 6],
          additional: 'testAdditional2',
        } as any,

        isReady: true,
      }),
      useLoadParamsMock,
      () => ({
        ...defaultInitialState,

        loadItems: () => ({
          items: [1, 2, 3],
        }),

        additional: 'testAdditional' as any,
      }),
      collectOptionsMock,
      useFilterlist as typeof useFilterlistBase,
      useRefMock,
      useMemoMock,
    );

    const result = await useFilterlist.mock.calls[0][0].loadItems({
      ...defaultInitialState,
      isFirstLoad: true,
    });

    expect(result).toEqual({
      items: [4, 5, 6],
      additional: 'testAdditional2',
    });
  });

  test('should throw error from `useIsomorphic` for first load', async () => {
    const useFilterlist = jest.fn<
    ReturnType<typeof useFilterlistBase>,
    Parameters<typeof useFilterlistBase>
    >()
      .mockReturnValue([defaultInitialState, null]);

    useFilterlistIsomorphicPure(
      'testId',
      defaultParams,
      () => ({
        ...defaultUseIsomorphicResponse,

        context: {
          items: [4, 5, 6],
          additional: 'testAdditional2',
        } as any,

        error: {
          error: 'testError',
          additional: 'testAdditional3',
        } as any,

        isReady: true,
      }),
      useLoadParamsMock,
      () => ({
        ...defaultInitialState,

        loadItems: () => ({
          items: [1, 2, 3],
        }),

        additional: 'testAdditional' as any,
      }),
      collectOptionsMock,
      useFilterlist as typeof useFilterlistBase,
      useRefMock,
      useMemoMock,
    );

    let catchedError: FilterlistError;

    try {
      await useFilterlist.mock.calls[0][0].loadItems({
        ...defaultInitialState,
        isFirstLoad: true,
      });
    } catch (e) {
      catchedError = e as FilterlistError;
    }

    expect(catchedError).toEqual({
      error: 'testError',
      additional: 'testAdditional3',
    });
  });

  test('should call `loadItems` with current state', async () => {
    const useFilterlist = jest.fn<
    ReturnType<typeof useFilterlistBase>,
    Parameters<typeof useFilterlistBase>
    >()
      .mockReturnValue([defaultInitialState, null]);

    const loadItems = jest.fn()
      .mockReturnValue({
        items: [4, 5, 6],
        additional: 'testAdditional',
      });

    useFilterlistIsomorphicPure(
      'testId',
      {
        ...defaultParams,
        loadItems,
      },
      () => ({
        ...defaultUseIsomorphicResponse,
        isReady: true,
      }),
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      useFilterlist as typeof useFilterlistBase,
      useRefMock,
      useMemoMock,
    );

    const result = await useFilterlist.mock.calls[0][0].loadItems({
      ...defaultInitialState,
      items: [1, 2, 3],
      isFirstLoad: false,
    });

    expect(result).toEqual({
      items: [4, 5, 6],
      additional: 'testAdditional',
    });

    expect(loadItems).toHaveBeenCalledTimes(1);
    expect(loadItems).toHaveBeenCalledWith(
      isomorphicParams,
      {
        ...defaultInitialState,
        items: [1, 2, 3],
        isFirstLoad: false,
      },
    );
  });

  test('should support LoadListError in `loadItems`', async () => {
    const useFilterlist = jest.fn<
    ReturnType<typeof useFilterlistBase>,
    Parameters<typeof useFilterlistBase>
    >()
      .mockReturnValue([defaultInitialState, null]);

    const loadItems = jest.fn()
      .mockRejectedValue(new LoadListError({
        error: 'testError',
        additional: 'testAdditional',
      }));

    useFilterlistIsomorphicPure(
      'testId',
      {
        ...defaultParams,
        loadItems,
      },
      () => ({
        ...defaultUseIsomorphicResponse,
        isReady: true,
      }),
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      useFilterlist as typeof useFilterlistBase,
      useRefMock,
      useMemoMock,
    );

    let catchedError: FilterlistError<any, any>;

    try {
      await useFilterlist.mock.calls[0][0].loadItems({
        ...defaultInitialState,
        isFirstLoad: false,
      });
    } catch (e) {
      catchedError = e as FilterlistError<any, any>;
    }

    expect(catchedError.error).toBe('testError');
    expect(catchedError.additional).toBe('testAdditional');
  });

  test('should throw up error that not implements `LoadListError`', async () => {
    const error = new Error('test error');

    const useFilterlist = jest.fn<
    ReturnType<typeof useFilterlistBase>,
    Parameters<typeof useFilterlistBase>
    >()
      .mockReturnValue([defaultInitialState, null]);

    const loadItems = jest.fn()
      .mockRejectedValue(error as never);

    useFilterlistIsomorphicPure(
      'testId',
      {
        ...defaultParams,
        loadItems,
      },
      () => ({
        ...defaultUseIsomorphicResponse,
        isReady: true,
      }),
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      useFilterlist as typeof useFilterlistBase,
      useRefMock,
      useMemoMock,
    );

    let catchedError: FilterlistError<any, any>;

    try {
      await useFilterlist.mock.calls[0][0].loadItems({
        ...defaultInitialState,
        isFirstLoad: false,
      });
    } catch (e) {
      catchedError = e as FilterlistError<any, any>;
    }

    expect(catchedError).toBe(error);
  });
});

describe('result', () => {
  test('should return default list state if context is not ready', () => {
    const filterlist = Symbol('filterlist');

    const result = useFilterlistIsomorphicPure(
      'testId',
      defaultParams,
      () => ({
        ...defaultUseIsomorphicResponse,
        isReady: false,
      }),
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      () => [
        {} as any,
        filterlist as any,
      ],
      useRefMock,
      useMemoMock,
    );

    expect(result).toEqual([
      defaultInitialState,
      filterlist,
    ]);
  });

  test('should return null if list state is null', () => {
    const filterlist = Symbol('filterlist');

    const result = useFilterlistIsomorphicPure(
      'testId',
      defaultParams,
      () => ({
        ...defaultUseIsomorphicResponse,

        context: {
          items: [1, 2, 3],
          additional: 'testAdditional1',
        } as any,

        isReady: true,
      }),
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      () => [
        null,
        filterlist as any,
      ],
      useRefMock,
      useMemoMock,
    );

    expect(result).toEqual([
      null,
      filterlist,
    ]);
  });

  test('should return list state with result of `useIsomorphic` for first load', () => {
    const filterlist = Symbol('filterlist');

    const result = useFilterlistIsomorphicPure(
      'testId',
      defaultParams,
      () => ({
        ...defaultUseIsomorphicResponse,

        context: {
          items: [1, 2, 3],
          additional: 'testAdditional1',
        } as any,

        isReady: true,
      }),
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      () => [
        {
          ...defaultInitialState,
          filters: {
            filter1: 'value1',
          },
          items: [4, 5, 6],
          additional: 'testAdditional2',
          isFirstLoad: true,
        } as any,
        filterlist as any,
      ],
      useRefMock,
      useMemoMock,
    );

    expect(result).toEqual([
      {
        ...defaultInitialState,
        items: [1, 2, 3],
        additional: 'testAdditional1',
      },
      filterlist,
    ]);
  });

  test('should return list state with error of `useIsomorphic` for first load', () => {
    const filterlist = Symbol('filterlist');

    const result = useFilterlistIsomorphicPure(
      'testId',
      defaultParams,
      () => ({
        ...defaultUseIsomorphicResponse,

        error: {
          error: 'test error',
          additional: 'error additional',
        } as any,

        isReady: true,
      }),
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      () => [
        {
          ...defaultInitialState,
          filters: {
            filter1: 'value1',
          },
          items: [4, 5, 6],
          additional: 'testAdditional2',
          isFirstLoad: true,
        } as any,
        filterlist as any,
      ],
      useRefMock,
      useMemoMock,
    );

    expect(result).toEqual([
      {
        ...defaultInitialState,
        error: 'test error',
        additional: 'error additional',
      },
      filterlist,
    ]);
  });

  test('should return list state with result of `useFilterlist` for not first load', () => {
    const filterlist = Symbol('filterlist');

    const result = useFilterlistIsomorphicPure(
      'testId',
      defaultParams,
      () => ({
        ...defaultUseIsomorphicResponse,

        context: {
          items: [1, 2, 3],
          additional: 'testAdditional1',
        } as any,

        isReady: true,
      }),
      useLoadParamsMock,
      collectListInitialStateMock,
      collectOptionsMock,
      () => [
        {
          ...defaultInitialState,
          filters: {
            filter1: 'value1',
          },
          items: [4, 5, 6],
          additional: 'testAdditional2',
          isFirstLoad: false,
        } as any,
        filterlist as any,
      ],
      useRefMock,
      useMemoMock,
    );

    expect(result).toEqual([
      {
        ...defaultInitialState,
        filters: {
          filter1: 'value1',
        },
        items: [4, 5, 6],
        additional: 'testAdditional2',
        isFirstLoad: false,
      },
      filterlist,
    ]);
  });
});
