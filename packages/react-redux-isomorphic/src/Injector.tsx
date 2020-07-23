import React, { Component } from 'react';
import type {
  ReactNode,
} from 'react';

import IsomorphicContext from './context';

export type InjectorProps<LoadParams = Record<string, any>> = {
  children: (loadParams: LoadParams) => ReactNode;
};

class Injector<LoadParams = Record<string, any>> extends Component<InjectorProps<LoadParams>> {
  renderChildren = ({
    loadParams,
  }: {
    loadParams: Record<string, any>;
  }): ReactNode => {
    const {
      children,
    } = this.props;

    return children(loadParams as LoadParams);
  };

  render(): ReactNode {
    return (
      <IsomorphicContext.Consumer>
        {this.renderChildren}
      </IsomorphicContext.Consumer>
    );
  }
}

export default Injector;
