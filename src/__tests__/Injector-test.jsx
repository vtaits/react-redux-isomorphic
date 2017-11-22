import React from 'react';
import { shallow } from 'enzyme';

import Injector from '../Injector';

const reactContext = {
  reactReduxIsomorphic: {
    loadParams: {
      fetch: () => Promise.resolve(123),
      isServerRender: true,
    },
  },
};

const TestComponent = () => <div />;

test('should add loadParams to component props', () => {
  const wrapper = shallow(
    <Injector
      component={TestComponent}
      testProp="testValue"
    />,
    {
      context: reactContext,
    },
  );

  const testComponentNode = wrapper.find(TestComponent);

  expect(testComponentNode.length).toEqual(1);
  expect(testComponentNode.prop('testProp')).toEqual('testValue');
  expect(testComponentNode.prop('loadParams'))
    .toEqual(reactContext.reactReduxIsomorphic.loadParams);
});
