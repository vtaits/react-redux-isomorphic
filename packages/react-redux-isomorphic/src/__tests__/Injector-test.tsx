import type {
  FC,
} from 'react';
import { mount } from 'enzyme';

import IsomorphicProvider from '../IsomorphicProvider';

import Injector from '../Injector';

const defaultLoadParams = {
  fetch: () => Promise.resolve(123),
  isServerRender: true,
};

const TestComponent: FC<{
  loadParams: Record<string, any>;
  testProp: string;
}> = () => <div />;

test('should add loadParams to component props', () => {
  const wrapper = mount(
    <IsomorphicProvider loadParams={defaultLoadParams}>
      <Injector>
        {(loadParams) => (
          <TestComponent
            loadParams={loadParams}
            testProp="testValue"
          />
        )}
      </Injector>
    </IsomorphicProvider>,
  );

  const testComponentNode = wrapper.find(TestComponent);

  expect(testComponentNode.length).toBe(1);
  expect(testComponentNode.prop('testProp')).toBe('testValue');
  expect(testComponentNode.prop('loadParams')).toBe(defaultLoadParams);
});
