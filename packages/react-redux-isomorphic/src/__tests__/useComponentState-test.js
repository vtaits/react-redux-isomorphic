import * as reactRedux from 'react-redux';

import useComponentState from '../useComponentState';

afterEach(() => {
  jest.clearAllMocks();
});

const mock = ({
  useSelector = Function.prototype,
}) => {
  jest.spyOn(reactRedux, 'useSelector').mockImplementation(useSelector);
};

test('should return response of useSelector', () => {
  const componentState = Symbol('Component state');

  mock({
    useSelector: () => componentState,
  });

  expect(useComponentState()).toBe(componentState);
});
