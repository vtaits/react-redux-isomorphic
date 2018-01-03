import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Grid } from 'react-bootstrap';

import { isomorphic, isomorphicPropTypes, LoadContextError } from 'react-redux-isomorphic';

const UserPage = ({
  isomorphic: {
    isReady,
    context: user,
    error,
  },
}) => {
  if (error) {
    return (
      <Grid>
        <h1>User not found</h1>

        <p>
          <Link to='/'>Back to users page</Link>
        </p>
      </Grid>
    );
  }

  if (!isReady) {
    return (
      <Grid>
        <h2>Loading...</h2>

        <p>
          <Link to='/'>Back to users page</Link>
        </p>
      </Grid>
    );
  }

  return (
    <Grid>
      <h1>{user.name || user.login}</h1>

      {
        user.name && (
          <p>Name: {user.name}</p>
        )
      }

      {
        user.public_repos && (
          <p>Public repos: {user.public_repos}</p>
        )
      }

      {
        user.public_gists && (
          <p>Public gists: {user.public_gists}</p>
        )
      }

      {
        user.followers && (
          <p>Followers: {user.followers}</p>
        )
      }

      {
        user.following && (
          <p>Following: {user.following}</p>
        )
      }

      <p>
        <Link to='/'>Back to users page</Link>
      </p>
    </Grid>
  );
}

UserPage.propTypes = {
  isomorphic: isomorphicPropTypes({
    context: PropTypes.shape({
      id: PropTypes.number.isRequired,
      login: PropTypes.string.isRequired,
      name: PropTypes.string,
      public_repos: PropTypes.number.isRequired,
      public_gists: PropTypes.number.isRequired,
      followers: PropTypes.number.isRequired,
      following: PropTypes.number.isRequired,
    }),
  }),
};

export default isomorphic({
  isomorphicId: 'userDetail',

  getContext: async ({ fetch, setTitle, setStatus }, { match }) => {
    const githubResponse = await fetch(`/api/users/${match.params.userId}`);

    const status = githubResponse.status;
    const json = await githubResponse.json();

    setStatus(status);

    if (status < 400) {
      const userName = json.name || json.login;

      setTitle(`User: ${userName}`);
    } else {
      setTitle(json.message);

      throw new LoadContextError({
        status,
        json,
      });
    }

    return json;
  },
})(UserPage);
