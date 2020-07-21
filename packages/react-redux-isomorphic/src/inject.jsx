/* eslint-disable react/jsx-props-no-spreading */

import React, { Component } from 'react';

import Injector from './Injector';

export default function inject(WrappedComponent) {
  class WithLoadParams extends Component {
    renderContent = (loadParams) => (
      <WrappedComponent
        {...this.props}
        loadParams={loadParams}
      />
    );

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
