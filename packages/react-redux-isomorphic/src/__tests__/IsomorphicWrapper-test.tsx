/* eslint-disable max-classes-per-file,react/jsx-props-no-spreading */

import React from 'react';
import { shallow } from 'enzyme';
import type {
  ShallowWrapper,
} from 'enzyme';

import { isomorphicProps } from '../fixtures';

import { ContextResolver } from '../IsomorphicWrapper';
import type {
  ContextResolverProps,
} from '../IsomorphicWrapper';

import { LoadContextError } from '../errors';

const TestComponent = () => <div />;

const defaultLoadParams = {
  fetch: () => Promise.resolve(123),
  isServerRender: true,
};

const defaultProps = {
  ...isomorphicProps,

  component: TestComponent,
  componentProps: {
    prop: 'value',
  },

  isomorphicId: 'test',

  loadParams: defaultLoadParams,
  getContext: () => {},

  loadContext: () => {},
  loadContextSuccess: () => {},
  loadContextError: () => {},

  destroy: () => {},
};

class ManualContextResolver extends ContextResolver<any, any, any, any> {
  // eslint-disable-next-line class-methods-use-this
  init(): Promise<void> {
    const {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      initFn,
    } = this.props;

    if (initFn) {
      initFn();
    }

    return Promise.resolve();
  }

  componentDidUpdate(): Promise<void> {
    return Promise.resolve();
  }

  manualComponentDidUpdate(oldProps) {
    return super.componentDidUpdate(oldProps);
  }

  manualInit() {
    return super.init();
  }
}

class PageObject {
  wrapper: ShallowWrapper<ContextResolverProps<any, any, any, any>, any, ManualContextResolver>;

  constructor(props: Partial<ContextResolverProps<any, any, any, any>>, initFn: jest.Mock) {
    this.wrapper = shallow(
      <ManualContextResolver
        {...defaultProps}
        {...props}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        initFn={initFn}
      />,
    );
  }

  manualInit() {
    return this.wrapper.instance().manualInit();
  }

  manualUpdate(newProps) {
    const oldProps = this.wrapper.instance().props;

    this.wrapper.setProps(newProps);

    return this.wrapper.instance().manualComponentDidUpdate(oldProps);
  }
}

function setup(
  props: Partial<ContextResolverProps<any, any, any, any>>,
  initFn?: jest.Mock,
): PageObject {
  return new PageObject(props, initFn);
}

test('should render TestComponent with correct props', () => {
  const wrapper = shallow(
    <ContextResolver
      {...defaultProps}
    />,
  );

  const testComponentNode = wrapper.find(TestComponent);
  expect(testComponentNode.length).toEqual(1);
  expect(testComponentNode.prop('prop')).toEqual('value');
  expect(testComponentNode.prop('isomorphic')).toBeTruthy();
  expect(testComponentNode.prop('isomorphic')).toBe(defaultProps.isomorphic);
});

test('should call loadContext on init if not ready', async () => {
  const loadContext = jest.fn();

  const page = setup({
    loadContext,
  });

  await page.manualInit();

  expect(loadContext.mock.calls.length).toBe(1);
  expect(loadContext.mock.calls[0]).toEqual(['test']);
});

test('should not call loadContext on init if ready', async () => {
  const loadContext = jest.fn();

  const page = setup({
    loadContext,

    isomorphic: {
      ...defaultProps.isomorphic,
      isReady: true,
    },
  });

  await page.manualInit();

  expect(loadContext.mock.calls.length).toBe(0);
});

test('should call getContext and loadContextSuccess', async () => {
  const callsSequence = [];

  const page = setup({
    getContext: (arg1, arg2) => {
      callsSequence.push(['getContext', arg1, arg2]);

      return 'testContext';
    },

    loadContextSuccess: (arg1, arg2) => {
      callsSequence.push(['loadContextSuccess', arg1, arg2]);
    },

    loadContextError: (arg1, arg2) => {
      callsSequence.push(['loadContextError', arg1, arg2]);
    },
  });

  await page.manualInit();

  expect(callsSequence).toEqual([
    ['getContext', defaultLoadParams, {
      prop: 'value',
    }],
    ['loadContextSuccess', 'test', 'testContext'],
  ]);
});

test('should call getContext and loadContextError', async () => {
  const callsSequence = [];

  const page = setup({
    getContext: (arg1, arg2) => {
      callsSequence.push(['getContext', arg1, arg2]);

      throw new LoadContextError('testError');
    },

    loadContextSuccess: (arg1, arg2) => {
      callsSequence.push(['loadContextSuccess', arg1, arg2]);
    },

    loadContextError: (arg1, arg2) => {
      callsSequence.push(['loadContextError', arg1, arg2]);
    },
  });

  await page.manualInit();

  expect(callsSequence).toEqual([
    ['getContext', defaultLoadParams, {
      prop: 'value',
    }],
    ['loadContextError', 'test', 'testError'],
  ]);
});

test('should not call getContext, loadContextSuccess and loadContextError if ready', async () => {
  const callsSequence = [];

  const page = setup({
    isomorphic: {
      ...defaultProps.isomorphic,
      isReady: true,
    },

    getContext: (arg1, arg2) => {
      callsSequence.push(['getContext', arg1, arg2]);
    },

    loadContextSuccess: (arg1, arg2) => {
      callsSequence.push(['loadContextSuccess', arg1, arg2]);
    },

    loadContextError: (arg1, arg2) => {
      callsSequence.push(['loadContextError', arg1, arg2]);
    },
  });

  await page.manualInit();

  expect(callsSequence).toEqual([]);
});

test('should call destroy on unmount', () => {
  const destroy = jest.fn();

  const wrapper = shallow(
    <ContextResolver
      {...defaultProps}
      destroy={destroy}
    />,
  );

  wrapper.unmount();

  expect(destroy.mock.calls.length).toEqual(1);
  expect(destroy.mock.calls[0]).toEqual(['test']);
});

test('should not call init and destroy on update if shouldReload is not defined', async () => {
  const init = jest.fn();
  const destroy = jest.fn();

  const page = setup({
    destroy,
  }, init);

  await page.manualUpdate({
    ...defaultProps,

    componentProps: {
      prop: 'value',
    },
  });

  expect(init.mock.calls.length).toBe(1);
  expect(destroy.mock.calls.length).toBe(0);
});

test('should call shouldReload with correct arguments', async () => {
  const shouldReload = jest.fn();

  const page = setup({
    shouldReload,
  });

  await page.manualUpdate({
    ...defaultProps,

    componentProps: {
      prop: 'value2',
    },
  });

  expect(shouldReload.mock.calls.length).toBe(1);
  expect(shouldReload.mock.calls[0]).toEqual([
    {
      prop: 'value2',
    },

    {
      prop: 'value',
    },
  ]);
});

test('should not call init and destroy on update if shouldReload returns false', async () => {
  const init = jest.fn();
  const destroy = jest.fn();

  const page = setup({
    destroy,

    shouldReload: () => false,
  }, init);

  await page.manualUpdate({
    ...defaultProps,

    componentProps: {
      prop: 'value2',
    },
  });

  expect(init.mock.calls.length).toBe(1);
  expect(destroy.mock.calls.length).toBe(0);
});

test('should call init and destroy on update if shouldReload returns true', async () => {
  const init = jest.fn();
  const destroy = jest.fn();

  const page = setup({
    destroy,

    shouldReload: () => true,
  }, init);

  await page.manualUpdate({
    ...defaultProps,
    destroy,

    componentProps: {
      prop: 'value2',
    },
  });

  expect(init.mock.calls.length).toBe(2);
  expect(destroy.mock.calls.length).toBe(1);
  expect(destroy.mock.calls[0][0]).toBe('test');
});
