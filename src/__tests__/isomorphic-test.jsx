import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

import { Provider } from 'react-redux';

import IsomorphicProvider from '../IsomorphicProvider';
import IsomorphicWrapper from '../IsomorphicWrapper';
import { componentInitialState } from '../reducer';

import isomorphic from '../isomorphic';

const mockStore = configureStore([]);
const TestComponent = () => <div />;

test('should throw error if getContext is not a function', () => {
  expect(() => {
    isomorphic();
  }).toThrow();

  expect(() => {
    isomorphic({
      getContext: 1,
    });
  }).toThrow();

  expect(() => {
    isomorphic({
      getContext: {},
    });
  }).toThrow();
});

test('should throw error if shouldReload is defined and not a function', () => {
  expect(() => {
    isomorphic({
      getContext: () => {},
      shouldReload: 1,
    });
  }).toThrow();

  expect(() => {
    isomorphic({
      getContext: () => { },
      shouldReload: {},
    });
  }).toThrow();
});

test('should render IsomorphicWrapper by isomorphicId from decorator and default state', () => {
  const getContext = () => { };
  const shouldReload = () => {};

  const store = mockStore({
    reactReduxIsomorphic: {
      pendingComponents: [],
      componentsParams: {},
    },
  });

  const DecoratedComponent = isomorphic({
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
    </IsomorphicProvider>
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

  const DecoratedComponent = isomorphic({
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
    </IsomorphicProvider>
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

  const DecoratedComponent = isomorphic({
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
    </IsomorphicProvider>
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

  const DecoratedComponent = isomorphic({
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
    </IsomorphicProvider>
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
