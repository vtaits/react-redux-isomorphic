import PropTypes from 'prop-types';
import checkPropTypes from 'check-prop-types';

import {
  isomorphicIdPropTypes,
  isomorphicPropTypes,
} from '../propTypes';

import { componentInitialState } from '../reducer';

describe('isomorphicIdPropTypes', () => {
  test('should accept number as isomorphicId', () => {
    expect(checkPropTypes(
      {
        isomorphicId: isomorphicIdPropTypes,
      },
      {
        isomorphicId: 1,
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });

  test('should accept string as isomorphicId', () => {
    expect(checkPropTypes(
      {
        isomorphicId: isomorphicIdPropTypes,
      },
      {
        isomorphicId: '1',
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });
});

describe('isomorphicPropTypes', () => {
  test('should accept componentInitialState', () => {
    expect(checkPropTypes(
      {
        isomorphic: isomorphicPropTypes({}),
      },
      {
        isomorphic: componentInitialState,
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });

  test('should accept custom context', () => {
    expect(checkPropTypes(
      {
        isomorphic: isomorphicPropTypes({
          context: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            value: PropTypes.shape({
              label: PropTypes.string.isRequired,
            }).isRequired,
          }),
        }),
      },
      {
        isomorphic: {
          ...componentInitialState,
          context: {
            id: 1,
            name: 'test string',
            value: {
              label: 'label of test object',
            },
          },
        },
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });

  test('should accept custom error', () => {
    expect(checkPropTypes(
      {
        isomorphic: isomorphicPropTypes({
          error: PropTypes.shape({
            status: PropTypes.number.isRequired,
            message: PropTypes.string.isRequired,
          }),
        }),
      },
      {
        isomorphic: {
          ...componentInitialState,
          error: {
            status: 500,
            message: 'Test error',
          },
        },
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });
});
