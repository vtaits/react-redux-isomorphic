import React from 'react';

import Injector from './Injector';

export default function inject(component) {
  const WithLoadParams = (props) => (
    <Injector
      component={component}
      {...props}
    />
  );

  return WithLoadParams;
}
