import type {
  ReactElement,
} from 'react';

import { Link } from 'react-router-dom';

import { Container, Table } from 'react-bootstrap';

import { isomorphic, LoadContextError } from 'react-redux-isomorphic';
import type {
  SingleState,
} from 'react-redux-isomorphic';

import type {
  User,
} from '../types';

type IsomorphicContext = {
  items: User[];
};

type UsersPageProps = {
  isomorphic: SingleState<IsomorphicContext>;
};

function UsersPage({
  isomorphic: {
    isReady,
    context,
    error,
  },
}: UsersPageProps): ReactElement {
  if (error) {
    return (
      <Container>
        <h1>Error loading data</h1>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Github users</h1>

      {
        isReady ? (
          <Table>
            <thead>
              <tr>
                <th>
                  Login
                </th>

                <th>
                  Score
                </th>
              </tr>
            </thead>

            <tbody>
              {
                context.items.map(({ id, login, score }) => (
                  <tr key={id}>
                    <td>
                      <Link to={`/${id}/`}>
                        {login}
                      </Link>
                    </td>

                    <td>
                      {score}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        ) : (
          <h2>Loading ...</h2>
        )
      }
    </Container>
  );
}

export default isomorphic<{}, IsomorphicContext>({
  isomorphicId: 'usersList',

  getContext: async ({ fetch, setTitle }) => {
    const githubResponse = await fetch('/api/users/');

    const status = githubResponse.status;
    const json = await githubResponse.json();

    if (status < 400) {
      setTitle('Github users');
    } else {
      setTitle(json.message);

      throw new LoadContextError({
        status,
        json,
      });
    }

    return {
      items: json,
    };
  },
})(UsersPage);
