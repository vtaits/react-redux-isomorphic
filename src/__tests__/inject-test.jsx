import React from 'react';
import { shallow } from 'enzyme';

import Injector from '../Injector';

import inject from '../inject';

test('should render injector with correct props', () => {
  const TestComponent = () => <div />;
  const WithLoadParams = inject(TestComponent);

  const wrapper = shallow(
    <WithLoadParams
      testProp="testValue"
    />,
  );

  const injectorNode = wrapper.find(Injector);

  expect(injectorNode.prop('component')).toBe(TestComponent);
  expect(injectorNode.prop('testProp')).toBe('testValue');
});
