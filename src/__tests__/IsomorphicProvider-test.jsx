import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import IsomorphicContext from '../context';

import IsomorphicProvider from '../IsomorphicProvider';

class TestComponent extends Component {
  static propTypes = {
    checkLoadParams: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.renderContent = this.renderContent.bind(this);
  }

  renderContent(loadParams) {
    const {
      checkLoadParams,
    } = this.props;

    checkLoadParams(loadParams);

    return (
      <div />
    );
  }

  render() {
    return (
      <IsomorphicContext.Consumer>
        {this.renderContent}
      </IsomorphicContext.Consumer>
    );
  }
}

test('should provide default loadParams', (done) => {
  const wrapper = mount(
    <IsomorphicProvider>
      <TestComponent
        checkLoadParams={(loadParams) => {
          expect(loadParams).toEqual({});
          done();
        }}
      />
    </IsomorphicProvider>,
  );

  expect(wrapper.find(TestComponent).length).toEqual(1);
});

test('should provide loadParams from props', (done) => {
  const fetch = () => Promise.resolve(123);

  const wrapper = mount(
    <IsomorphicProvider
      loadParams={{
        fetch,
        isServerRender: true,
      }}
    >
      <TestComponent
        checkLoadParams={(loadParams) => {
          expect(loadParams).toEqual({
            fetch,
            isServerRender: true,
          });
          done();
        }}
      />
    </IsomorphicProvider>,
  );

  expect(wrapper.find(TestComponent).length).toEqual(1);
});
