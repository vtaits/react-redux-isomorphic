import React, { Component } from 'react';

import Injector from './Injector';

export default function inject(WrappedComponent) {
  class WithLoadParams extends Component {
    constructor(props) {
      super(props);

      this.renderContent = this.renderContent.bind(this);
    }

    renderContent(loadParams) {
      return (
        <WrappedComponent
          {...this.props}
          loadParams={loadParams}
        />
      );
    }

    render() {
      return (
        <Injector>
          {this.renderContent}
        </Injector>
      );
    }
  }

  return WithLoadParams;
}
