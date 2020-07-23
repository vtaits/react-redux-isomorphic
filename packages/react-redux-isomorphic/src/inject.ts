/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import type {
  ComponentType,
  FC,
} from 'react';

import useLoadParams from './useLoadParams';

const inject = <BaseProps, LoadParams = Record<string, any>>(
  WrappedComponent: ComponentType<BaseProps & {
    loadParams: LoadParams,
  }>,
): ComponentType<BaseProps> => {
  const WithLoadParams: FC<BaseProps> = (props) => {
    const loadParams = useLoadParams<LoadParams>();

    return React.createElement(
      WrappedComponent,
      {
        ...props,
        loadParams,
      },
    );
  };

  return WithLoadParams;
};

export default inject;
