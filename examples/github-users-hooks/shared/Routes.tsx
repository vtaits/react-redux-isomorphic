import type {
  FC,
} from 'react';
import loadable from '@loadable/component';

import { Switch, Route } from 'react-router-dom';

const Page404 = loadable(() => import('./page404'));
const User = loadable(() => import('./user'));
const Users = loadable(() => import('./users'));

const Routes: FC = () => (
  <Switch>
    <Route
      path="/:userId/"
      component={User}
    />

    <Route
      path="/"
      component={Users}
    />

    <Route
      path="*"
      component={Page404}
    />
  </Switch>
);

export default Routes;
