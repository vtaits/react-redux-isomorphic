import type {
  ReactElement,
} from 'react';
import loadable from '@loadable/component';

import { Routes as RouterRoutes, Route } from 'react-router-dom';

const Page404 = loadable(() => import('./page404'));
const User = loadable(() => import('./user'));
const Users = loadable(() => import('./users'));

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
