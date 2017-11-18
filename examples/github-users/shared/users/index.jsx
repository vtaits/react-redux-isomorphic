import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { Grid, Table } from 'react-bootstrap';

import { isomorphic, isomorphicPropTypes } from 'react-redux-isomorphic';

const UsersPage = ({
  isomorphic: {
    isReady,
    context,
  },
}) => (
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
              context.items.map(({ id, login, score }) => (
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

UsersPage.propTypes = {
  isomorphic: isomorphicPropTypes({
    context: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        login: PropTypes.string.isRequired,
        score: PropTypes.number,
      })),
    }),
  }),
};

export default isomorphic({
  isomorphicId: 'usersList',

  getContext: async ({ fetch, setTitle, setStatus }) => {
    const githubResponse = await fetch(`/api/search/users?q=e`);

    const status = githubResponse.status;
    const json = await githubResponse.json();

    if (status < 400) {
      setTitle('Github users');
    } else {
      setTitle(json.message);

      return Promise.reject({
        status,
        json,
      });
    }

    return json;
  },
})(UsersPage);
