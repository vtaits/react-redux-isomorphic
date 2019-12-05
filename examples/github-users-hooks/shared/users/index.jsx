import React from 'react';

import { Link } from 'react-router-dom';

import { Container, Table } from 'react-bootstrap';

import { useIsomorphic, LoadContextError } from 'react-redux-isomorphic';

const UsersPage = () => {
  const {
    isReady,
    context: isomorphicContext,
    error,
  } = useIsomorphic('usersList', async ({ fetch, setTitle }) => {
    const usersResponse = await fetch('/api/users/');

    const { status } = usersResponse;
    const json = await usersResponse.json();

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
  });

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
                isomorphicContext.items.map(({ id, login, score }) => (
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
};

export default UsersPage;
