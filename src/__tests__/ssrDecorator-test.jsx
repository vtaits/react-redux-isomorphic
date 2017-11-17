import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

import { Provider } from 'react-redux';

import SSRProvider from '../SSRProvider';
import SSRWrapper from '../SSRWrapper';
import { componentInitialState } from '../reducer';

import ssrDecorator from '../ssrDecorator';

const mockStore = configureStore([]);
const TestComponent = () => <div />;

test('should throw error if getContext is not a function', () => {
  expect(() => {
    ssrDecorator();
  }).toThrow();

  expect(() => {
    ssrDecorator({
      getContext: 1,
    });
  }).toThrow();

  expect(() => {
    ssrDecorator({
      getContext: {},
    });
  }).toThrow();
});

test('should render SSRWrapper by ssrId from decorator and default state', () => {
  const getContext = () => {};

  const store = mockStore({
    reactReduxSSR: {
      pendingComponents: [],
      componentsParams: {},
    },
  });

  const DecoratedComponent = ssrDecorator({
    ssrId: 'test',
    getContext,
  })(TestComponent);

  const wrapper = mount(
    <SSRProvider>
      <Provider store={store}>
        <DecoratedComponent
          prop="value"
        />
      </Provider>
    </SSRProvider>
  );

  const ssrWrapperNode = wrapper.find(SSRWrapper);

  expect(ssrWrapperNode.prop('component')).toBe(TestComponent);
  expect(ssrWrapperNode.prop('componentProps')).toEqual({
    prop: 'value',
  });
  expect(ssrWrapperNode.prop('ssrId')).toBe('test');
  expect(ssrWrapperNode.prop('ssr')).toEqual(componentInitialState);
  expect(ssrWrapperNode.prop('getContext')).toBe(getContext);

  expect(ssrWrapperNode.prop('loadContext')).toBeInstanceOf(Function);
  expect(ssrWrapperNode.prop('loadContextSuccess')).toBeInstanceOf(Function);
  expect(ssrWrapperNode.prop('loadContextError')).toBeInstanceOf(Function);
  expect(ssrWrapperNode.prop('destroy')).toBeInstanceOf(Function);
});

test('should render SSRWrapper by ssrId from props and default state', () => {
  const getContext = () => {};

  const store = mockStore({
    reactReduxSSR: {
      pendingComponents: [],
      componentsParams: {},
    },
  });

  const DecoratedComponent = ssrDecorator({
    getContext,
  })(TestComponent);

  const wrapper = mount(
    <SSRProvider>
      <Provider store={store}>
        <DecoratedComponent
          ssrId="test"
          prop="value"
        />
      </Provider>
    </SSRProvider>
  );

  const ssrWrapperNode = wrapper.find(SSRWrapper);

  expect(ssrWrapperNode.prop('component')).toBe(TestComponent);
  expect(ssrWrapperNode.prop('componentProps')).toEqual({
    ssrId: 'test',
    prop: 'value',
  });
  expect(ssrWrapperNode.prop('ssrId')).toBe('test');
  expect(ssrWrapperNode.prop('ssr')).toEqual(componentInitialState);
  expect(ssrWrapperNode.prop('getContext')).toBe(getContext);

  expect(ssrWrapperNode.prop('loadContext')).toBeInstanceOf(Function);
  expect(ssrWrapperNode.prop('loadContextSuccess')).toBeInstanceOf(Function);
  expect(ssrWrapperNode.prop('loadContextError')).toBeInstanceOf(Function);
  expect(ssrWrapperNode.prop('destroy')).toBeInstanceOf(Function);
});

test('should render SSRWrapper by ssrId from decorator and state from store', () => {
  const getContext = () => {};

  const store = mockStore({
    reactReduxSSR: {
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

  const DecoratedComponent = ssrDecorator({
    ssrId: 'test',
    getContext,
  })(TestComponent);

  const wrapper = mount(
    <SSRProvider>
      <Provider store={store}>
        <DecoratedComponent
          prop="value"
        />
      </Provider>
    </SSRProvider>
  );

  const ssrWrapperNode = wrapper.find(SSRWrapper);

  expect(ssrWrapperNode.prop('component')).toBe(TestComponent);
  expect(ssrWrapperNode.prop('componentProps')).toEqual({
    prop: 'value',
  });
  expect(ssrWrapperNode.prop('ssrId')).toBe('test');
  expect(ssrWrapperNode.prop('ssr')).toEqual({
    ...componentInitialState,
    isReady: true,
    context: {
      contextProp: 'contextValue',
    },
  });
  expect(ssrWrapperNode.prop('getContext')).toBe(getContext);

  expect(ssrWrapperNode.prop('loadContext')).toBeInstanceOf(Function);
  expect(ssrWrapperNode.prop('loadContextSuccess')).toBeInstanceOf(Function);
  expect(ssrWrapperNode.prop('loadContextError')).toBeInstanceOf(Function);
  expect(ssrWrapperNode.prop('destroy')).toBeInstanceOf(Function);
});

test('should render SSRWrapper by ssrId from decorator and state from store', () => {
  const getContext = () => {};

  const store = mockStore({
    reactReduxSSR: {
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

  const DecoratedComponent = ssrDecorator({
    getContext,
  })(TestComponent);

  const wrapper = mount(
    <SSRProvider>
      <Provider store={store}>
        <DecoratedComponent
          ssrId="test"
          prop="value"
        />
      </Provider>
    </SSRProvider>
  );

  const ssrWrapperNode = wrapper.find(SSRWrapper);

  expect(ssrWrapperNode.prop('component')).toBe(TestComponent);
  expect(ssrWrapperNode.prop('componentProps')).toEqual({
    ssrId: 'test',
    prop: 'value',
  });
  expect(ssrWrapperNode.prop('ssrId')).toBe('test');
  expect(ssrWrapperNode.prop('ssr')).toEqual({
    ...componentInitialState,
    isReady: true,
    context: {
      contextProp: 'contextValue',
    },
  });
  expect(ssrWrapperNode.prop('getContext')).toBe(getContext);

  expect(ssrWrapperNode.prop('loadContext')).toBeInstanceOf(Function);
  expect(ssrWrapperNode.prop('loadContextSuccess')).toBeInstanceOf(Function);
  expect(ssrWrapperNode.prop('loadContextError')).toBeInstanceOf(Function);
  expect(ssrWrapperNode.prop('destroy')).toBeInstanceOf(Function);
});
