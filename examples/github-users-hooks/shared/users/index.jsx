import React from 'react';

import { Link } from 'react-router-dom';

import { Grid, Table } from 'react-bootstrap';

import { useIsomorphic, LoadContextError } from 'react-redux-isomorphic';

const UsersPage = () => {
  const {
    isReady,
    context: isomorphicContext,
    error,
  } = useIsomorphic('usersList', async ({ fetch, setTitle }) => {
    const githubResponse = await fetch('/api/search/users?q=e');

    const { status } = githubResponse.status;
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

    return json;
  });

  if (error) {
    return (
      <Grid>
        <h1>Error loading data</h1>
      </Grid>
    );
  }

  return (
    <Grid>
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
                      <Link to={`/${login}/`}>
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
    </Grid>
  );
};

export default UsersPage;
