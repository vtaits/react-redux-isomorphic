import React from 'react';
import { shallow, mount } from 'enzyme';

import { ssrProps } from '../fixtures';

import SSRWrapper from '../SSRWrapper';

const TestComponent = () => <div />;

const defaultProps = {
  ...ssrProps,

  component: TestComponent,
  componentProps: {
    prop: 'value',
  },

  ssrId: 'test',

  getContext: () => {},

  loadContext: () => {},
  loadContextSuccess: () => {},
  loadContextError: () => {},

  destroy: () => {},
};

const reactContext = {
  reactReduxSSR: {
    loadParams: {
      fetch: () => Promise.resolve(123),
      isServerRender: true,
    },
  },
};

test('should render TestComponent with correct props', () => {
  const wrapper = shallow(
    <SSRWrapper
      {...defaultProps}
    />,
    {
      context: reactContext,
    }
  );

  const testComponentNode = wrapper.find(TestComponent);
  expect(testComponentNode.length).toEqual(1);
  expect(testComponentNode.prop('prop')).toEqual('value');
  expect(testComponentNode.prop('ssr')).toBeTruthy();
  expect(testComponentNode.prop('ssr')).toBe(defaultProps.ssr);
});

test('should call loadContext on init if not ready', () => {
  const loadContext = jest.fn();

  shallow(
    <SSRWrapper
      {...defaultProps}
      loadContext={loadContext}
    />,
    {
      context: reactContext,
    }
  );

  expect(loadContext.mock.calls.length).toBe(1);
  expect(loadContext.mock.calls[0]).toEqual(['test']);
});

test('should not call loadContext on init if ready', () => {
  const loadContext = jest.fn();

  shallow(
    <SSRWrapper
      {...defaultProps}
      ssr={{
        ...defaultProps.ssr,
        isReady: true,
      }}
      loadContext={loadContext}
    />,
    {
      context: reactContext,
    }
  );

  expect(loadContext.mock.calls.length).toBe(0);
});

test('should call getContext and loadContextSuccess', done => {
  let isGetContextCalled = false;
  let isLoadContextSuccessCalled = false;
  let isLoadContextErrorCalled = false;

  shallow(
    <SSRWrapper
      {...defaultProps}
      getContext={(arg1, arg2) => {
        expect(isGetContextCalled).toEqual(false);
        expect(isLoadContextSuccessCalled).toEqual(false);
        expect(isLoadContextErrorCalled).toEqual(false);

        isGetContextCalled = true;

        expect(arg1).toEqual(reactContext.reactReduxSSR.loadParams);
        expect(arg2).toEqual({
          prop: 'value',
        });

        return 'testContext';
      }}
      loadContextSuccess={(arg1, arg2) => {
        expect(isGetContextCalled).toEqual(true);
        expect(isLoadContextSuccessCalled).toEqual(false);
        expect(isLoadContextErrorCalled).toEqual(false);

        isLoadContextSuccessCalled = true;

        expect(arg1).toEqual('test');
        expect(arg2).toEqual('testContext');

        done();
      }}
      loadContextError={() => {
        isLoadContextErrorCalled = true;
      }}
    />,
    {
      context: reactContext,
    }
  );
});

test('should call getContext and loadContextError', done => {
  let isGetContextCalled = false;
  let isLoadContextSuccessCalled = false;
  let isLoadContextErrorCalled = false;

  shallow(
    <SSRWrapper
      {...defaultProps}
      getContext={(arg1, arg2) => {
        expect(isGetContextCalled).toEqual(false);
        expect(isLoadContextSuccessCalled).toEqual(false);
        expect(isLoadContextErrorCalled).toEqual(false);

        isGetContextCalled = true;

        expect(arg1).toEqual(reactContext.reactReduxSSR.loadParams);
        expect(arg2).toEqual({
          prop: 'value',
        });

        return Promise.reject('testError');
      }}
      loadContextSuccess={() => {
        isLoadContextSuccessCalled = true;
      }}
      loadContextError={(arg1, arg2) => {
        expect(isGetContextCalled).toEqual(true);
        expect(isLoadContextSuccessCalled).toEqual(false);
        expect(isLoadContextErrorCalled).toEqual(false);

        isLoadContextErrorCalled = true;

        expect(arg1).toEqual('test');
        expect(arg2).toEqual('testError');

        done();
      }}
    />,
    {
      context: reactContext,
    }
  );
});

test('should not call getContext, loadContextSuccess and loadContextError  if ready', done => {
  let isGetContextCalled = false;
  let isLoadContextSuccessCalled = false;
  let isLoadContextErrorCalled = false;

  shallow(
    <SSRWrapper
      {...defaultProps}
      ssr={{
        ...defaultProps.ssr,
        isReady: true,
      }}
      getContext={(arg1, arg2) => {
        isGetContextCalled = true;
      }}
      loadContextSuccess={() => {
        isLoadContextSuccessCalled = true;
      }}
      loadContextError={(arg1, arg2) => {
        isLoadContextErrorCalled = true;
      }}
    />,
    {
      context: reactContext,
    }
  );

  setTimeout(() => {
    expect(isGetContextCalled).toEqual(false);
    expect(isLoadContextSuccessCalled).toEqual(false);
    expect(isLoadContextErrorCalled).toEqual(false);

    done();
  });
});

test('should call destroy on unmount', () => {
  const destroy = jest.fn();

  const wrapper = shallow(
    <SSRWrapper
      {...defaultProps}
      destroy={destroy}
    />,
    {
      context: reactContext,
    }
  );

  wrapper.unmount();

  expect(destroy.mock.calls.length).toEqual(1);
  expect(destroy.mock.calls[0]).toEqual(['test']);
});
