import type {
  FC,
} from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

import { Provider } from 'react-redux';

import IsomorphicProvider from '../IsomorphicProvider';
import IsomorphicWrapper from '../IsomorphicWrapper';
import { componentInitialState } from '../reducer';

import isomorphic from '../isomorphic';

const mockStore = configureStore([]);
const TestComponent: FC<{
  [key: string]: any;
}> = () => <div />;

test('should throw error if getContext is not a function', () => {
  expect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    isomorphic();
  }).toThrow();

  expect(() => {
    isomorphic({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getContext: 1,
    });
  }).toThrow();

  expect(() => {
    isomorphic({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getContext: {},
    });
  }).toThrow();
});

test('should throw error if shouldReload is defined and not a function', () => {
  expect(() => {
    isomorphic({
      getContext: () => {},
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      shouldReload: 1,
    });
  }).toThrow();

  expect(() => {
    isomorphic({
      getContext: () => {},
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      shouldReload: {},
    });
  }).toThrow();
});

test('should render IsomorphicWrapper by isomorphicId from decorator and default state', () => {
  const getContext = () => {};
  const shouldReload = () => false;

  const store = mockStore({
    reactReduxIsomorphic: {
      pendingComponents: [],
      componentsParams: {},
    },
  });

  const DecoratedComponent = isomorphic<Record<string, any>, Record<string, any>, any, any>({
    isomorphicId: 'test',
    getContext,
    shouldReload,
  })(TestComponent);

  const wrapper = mount(
    <IsomorphicProvider>
      <Provider store={store}>
        <DecoratedComponent
          prop="value"
        />
      </Provider>
    </IsomorphicProvider>,
  );

  const isomorphicWrapperNode = wrapper.find(IsomorphicWrapper);

  expect(isomorphicWrapperNode.prop('component')).toBe(TestComponent);
  expect(isomorphicWrapperNode.prop('componentProps')).toEqual({
    prop: 'value',
  });
  expect(isomorphicWrapperNode.prop('isomorphicId')).toBe('test');
  expect(isomorphicWrapperNode.prop('isomorphic')).toEqual(componentInitialState);
  expect(isomorphicWrapperNode.prop('getContext')).toBe(getContext);
  expect(isomorphicWrapperNode.prop('shouldReload')).toBe(shouldReload);

  expect(isomorphicWrapperNode.prop('loadContext')).toBeInstanceOf(Function);
  expect(isomorphicWrapperNode.prop('loadContextSuccess')).toBeInstanceOf(Function);
  expect(isomorphicWrapperNode.prop('loadContextError')).toBeInstanceOf(Function);
  expect(isomorphicWrapperNode.prop('destroy')).toBeInstanceOf(Function);
});

test('should render IsomorphicWrapper by isomorphicId from props and default state', () => {
  const getContext = () => {};

  const store = mockStore({
    reactReduxIsomorphic: {
      pendingComponents: [],
      componentsParams: {},
    },
  });

  const DecoratedComponent = isomorphic<Record<string, any>, Record<string, any>, any, any>({
    getContext,
  })(TestComponent);

  const wrapper = mount(
    <IsomorphicProvider>
      <Provider store={store}>
        <DecoratedComponent
          isomorphicId="test"
          prop="value"
        />
      </Provider>
    </IsomorphicProvider>,
  );

  const isomorphicWrapperNode = wrapper.find(IsomorphicWrapper);

  expect(isomorphicWrapperNode.prop('component')).toBe(TestComponent);
  expect(isomorphicWrapperNode.prop('componentProps')).toEqual({
    isomorphicId: 'test',
    prop: 'value',
  });
  expect(isomorphicWrapperNode.prop('isomorphicId')).toBe('test');
  expect(isomorphicWrapperNode.prop('isomorphic')).toEqual(componentInitialState);
  expect(isomorphicWrapperNode.prop('getContext')).toBe(getContext);

  expect(isomorphicWrapperNode.prop('loadContext')).toBeInstanceOf(Function);
  expect(isomorphicWrapperNode.prop('loadContextSuccess')).toBeInstanceOf(Function);
  expect(isomorphicWrapperNode.prop('loadContextError')).toBeInstanceOf(Function);
  expect(isomorphicWrapperNode.prop('destroy')).toBeInstanceOf(Function);
});

test('should render IsomorphicWrapper by isomorphicId from decorator and state from store', () => {
  const getContext = () => {};

  const store = mockStore({
    reactReduxIsomorphic: {
      pendingComponents: [],
      componentsParams: {
        test: {
          ...componentInitialState,
          isReady: true,
          context: {
            contextProp: 'contextValue',
          },
        },
      },
    },
  });

  const DecoratedComponent = isomorphic<Record<string, any>, Record<string, any>, any, any>({
    isomorphicId: 'test',
    getContext,
  })(TestComponent);

  const wrapper = mount(
    <IsomorphicProvider>
      <Provider store={store}>
        <DecoratedComponent
          prop="value"
        />
      </Provider>
    </IsomorphicProvider>,
  );

  const isomorphicWrapperNode = wrapper.find(IsomorphicWrapper);

  expect(isomorphicWrapperNode.prop('component')).toBe(TestComponent);
  expect(isomorphicWrapperNode.prop('componentProps')).toEqual({
    prop: 'value',
  });
  expect(isomorphicWrapperNode.prop('isomorphicId')).toBe('test');
  expect(isomorphicWrapperNode.prop('isomorphic')).toEqual({
    ...componentInitialState,
    isReady: true,
    context: {
      contextProp: 'contextValue',
    },
  });
  expect(isomorphicWrapperNode.prop('getContext')).toBe(getContext);

  expect(isomorphicWrapperNode.prop('loadContext')).toBeInstanceOf(Function);
  expect(isomorphicWrapperNode.prop('loadContextSuccess')).toBeInstanceOf(Function);
  expect(isomorphicWrapperNode.prop('loadContextError')).toBeInstanceOf(Function);
  expect(isomorphicWrapperNode.prop('destroy')).toBeInstanceOf(Function);
});

test('should render IsomorphicWrapper by isomorphicId from decorator and state from store', () => {
  const getContext = () => {};

  const store = mockStore({
    reactReduxIsomorphic: {
      pendingComponents: [],
      componentsParams: {
        test: {
          ...componentInitialState,
          isReady: true,
          context: {
            contextProp: 'contextValue',
          },
        },
      },
    },
  });

  const DecoratedComponent = isomorphic<Record<string, any>, Record<string, any>, any, any>({
    getContext,
  })(TestComponent);

  const wrapper = mount(
    <IsomorphicProvider>
      <Provider store={store}>
        <DecoratedComponent
          isomorphicId="test"
          prop="value"
        />
      </Provider>
    </IsomorphicProvider>,
  );

  const isomorphicWrapperNode = wrapper.find(IsomorphicWrapper);

  expect(isomorphicWrapperNode.prop('component')).toBe(TestComponent);
  expect(isomorphicWrapperNode.prop('componentProps')).toEqual({
    isomorphicId: 'test',
    prop: 'value',
  });
  expect(isomorphicWrapperNode.prop('isomorphicId')).toBe('test');
  expect(isomorphicWrapperNode.prop('isomorphic')).toEqual({
    ...componentInitialState,
    isReady: true,
    context: {
      contextProp: 'contextValue',
    },
  });
  expect(isomorphicWrapperNode.prop('getContext')).toBe(getContext);

  expect(isomorphicWrapperNode.prop('loadContext')).toBeInstanceOf(Function);
  expect(isomorphicWrapperNode.prop('loadContextSuccess')).toBeInstanceOf(Function);
  expect(isomorphicWrapperNode.prop('loadContextError')).toBeInstanceOf(Function);
  expect(isomorphicWrapperNode.prop('destroy')).toBeInstanceOf(Function);
});
