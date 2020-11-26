/* eslint-disable react/jsx-props-no-spreading */

import type {
  ComponentType,
  FC,
} from 'react';

import useLoadParams from './useLoadParams';

function inject<BaseProps, LoadParams = Record<string, any>>(
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
