import { Component } from 'react';
import type {
  ReactNode,
} from 'react';

import IsomorphicContext from './context';
import type {
  DefaultLoadParams,
} from './types';

export type InjectorProps<LoadParams = DefaultLoadParams> = {
  children: (loadParams: LoadParams) => ReactNode;
};

class Injector<LoadParams = DefaultLoadParams> extends Component<InjectorProps<LoadParams>> {
  renderChildren = ({
    loadParams,
  }: {
    loadParams: DefaultLoadParams;
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
