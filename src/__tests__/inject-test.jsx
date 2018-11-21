import React from 'react';
import { mount } from 'enzyme';

import IsomorphicProvider from '../IsomorphicProvider';

import inject from '../inject';

test('should render injector with correct props', () => {
  const TestComponent = () => <div />;
  const WithLoadParams = inject(TestComponent);

  const wrapper = mount(
    <IsomorphicProvider
      loadParams={{
        testParam: 'testValue',
      }}
    >
      <WithLoadParams
        testProp="testValue"
      />
    </IsomorphicProvider>,
  );

  const testComponentNode = wrapper.find(TestComponent);

  expect(testComponentNode.prop('testProp')).toBe('testValue');
  expect(testComponentNode.prop('loadParams')).toEqual({
    testParam: 'testValue',
  });
});
