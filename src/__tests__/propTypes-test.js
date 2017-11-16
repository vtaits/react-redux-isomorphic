import PropTypes from 'prop-types';
import checkPropTypes from 'check-prop-types';

import {
  ssrIdPropTypes,
  ssrPropTypes,
} from '../propTypes';

import { componentInitialState } from '../reducer';

describe('ssrIdPropTypes', () => {
  test('should accept number as ssrId', () => {
    expect(checkPropTypes(
      {
        ssrId: ssrIdPropTypes,
      },
      {
        ssrId: 1,
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });

  test('should accept string as ssrId', () => {
    expect(checkPropTypes(
      {
        ssrId: ssrIdPropTypes,
      },
      {
        ssrId: '1',
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });
});

describe('ssrPropTypes', () => {
  test('should accept componentInitialState', () => {
    expect(checkPropTypes(
      {
        ssr: ssrPropTypes({}),
      },
      {
        ssr: componentInitialState,
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });

  test('should accept custom context', () => {
    expect(checkPropTypes(
      {
        ssr: ssrPropTypes({
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
        ssr: {
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
        ssr: ssrPropTypes({
          error: PropTypes.shape({
            status: PropTypes.number.isRequired,
            message: PropTypes.string.isRequired,
          }),
        }),
      },
      {
        ssr: {
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
