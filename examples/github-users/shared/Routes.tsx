import type {
  ReactElement,
} from 'react';

import { Routes as RouterRoutes, Route } from 'react-router-dom';

import Page404 from './page404';
import User from './user';
import Users from './users';

function Routes(): ReactElement {
  return (
    <RouterRoutes>
      <Route
        path="/:userId/"
        element={<User />}
      />

      <Route
        path="/"
        element={<Users />}
      />

      <Route
        path="*"
        element={<Page404 />}
      />
    </RouterRoutes>
  );
}

export default Routes;
