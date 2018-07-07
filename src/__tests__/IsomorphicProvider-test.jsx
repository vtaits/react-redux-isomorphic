import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import { reactReduxIsomorphicContextTypes } from '../contextTypes';

import IsomorphicProvider from '../IsomorphicProvider';

class TestComponent extends Component {
  static propTypes = {
    checkContext: PropTypes.func.isRequired,
  }

  static contextTypes = {
    reactReduxIsomorphic: reactReduxIsomorphicContextTypes.isRequired,
  }

  componentDidMount() {
    const {
      checkContext,
    } = this.props;

    checkContext(this.context);
  }

  render() {
    return (
      <div />
    );
  }
}

test('should provide default loadParams', (done) => {
  const wrapper = mount(
    <IsomorphicProvider>
      <TestComponent
        checkContext={(context) => {
          const {
            reactReduxIsomorphic,
          } = context;

          expect(reactReduxIsomorphic.loadParams).toEqual({});
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
        checkContext={(context) => {
          const {
            reactReduxIsomorphic,
          } = context;

          expect(reactReduxIsomorphic.loadParams).toEqual({
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
