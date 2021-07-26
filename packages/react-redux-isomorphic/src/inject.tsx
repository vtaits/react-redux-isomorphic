/* eslint-disable react/jsx-props-no-spreading */

import type {
  ComponentType,
  FC,
} from 'react';

import useLoadParams from './useLoadParams';
import type {
  DefaultLoadParams,
} from './types';

function inject<BaseProps, LoadParams = DefaultLoadParams>(
  WrappedComponent: ComponentType<BaseProps & {
    loadParams: LoadParams,
  }>,
): ComponentType<BaseProps> {
  const WithLoadParams: FC<BaseProps> = (props) => {
    const loadParams = useLoadParams<LoadParams>();

    return (
      <WrappedComponent
        {...props}
        loadParams={loadParams}
      />
    );
  };

  return WithLoadParams;
}

export default inject;
