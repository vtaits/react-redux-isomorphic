import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import { reactReduxSSRContextTypes } from '../contextTypes';

import SSRProvider from '../SSRProvider';

class TestComponent extends Component {
  static contextTypes = {
    reactReduxSSR: reactReduxSSRContextTypes.isRequired,
  }

  static propTypes = {
    checkContext: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.checkContext(this.context);
  }

  render() {
    return (
      <div />
    );
  }
}

test('should provide default loadParams', done => {
  const wrapper = mount(
    <SSRProvider>
      <TestComponent
        checkContext={(context) => {
          expect(context.reactReduxSSR.loadParams).toEqual({});
          done();
        }}
      />
    </SSRProvider>
  );

  expect(wrapper.find(TestComponent).length).toEqual(1);
});

test('should provide loadParams from props', done => {
  const fetch = () => Promise.resolve(123);

  const wrapper = mount(
    <SSRProvider loadParams={{
      fetch,
      isServerRender: true,
    }}>
      <TestComponent
        checkContext={(context) => {
          expect(context.reactReduxSSR.loadParams).toEqual({
            fetch,
            isServerRender: true,
          });
          done();
        }}
      />
    </SSRProvider>
  );

  expect(wrapper.find(TestComponent).length).toEqual(1);
});
