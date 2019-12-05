import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Container } from 'react-bootstrap';

import { isomorphic, isomorphicPropTypes, LoadContextError } from 'react-redux-isomorphic';

const UserPage = ({
  isomorphic: {
    isReady,
    context,
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

  const {
    user,
    otherUsers,
  } = context;

  return (
    <Container>
      <h1>{user.name || user.login}</h1>

      {
        user.name && (
          <p>
            Name:
            {' '}
            {user.name}
          </p>
        )
      }

      {
        user.public_repos && (
          <p>
            Public repos:
            {' '}
            {user.public_repos}
          </p>
        )
      }

      {
        user.public_gists && (
          <p>
            Public gists:
            {' '}
            {user.public_gists}
          </p>
        )
      }

      {
        user.followers && (
          <p>
            Followers:
            {' '}
            {user.followers}
          </p>
        )
      }

      {
        user.following && (
          <p>
            Following:
            {' '}
            {user.following}
          </p>
        )
      }

      <p>
        <Link to='/'>Back to users page</Link>
      </p>

      {
        otherUsers.length > 0 && (
          <div>
            <p>Other users:</p>

            <ul>
              {
                otherUsers.map(({ id, login }) => (
                  <li key={id}>
                    <Link to={`/${login}/`}>
                      {login}
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>
        )
      }
    </Container>
  );
};

UserPage.propTypes = {
  isomorphic: isomorphicPropTypes({
    context: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        login: PropTypes.string.isRequired,
        name: PropTypes.string,
        public_repos: PropTypes.number.isRequired,
        public_gists: PropTypes.number.isRequired,
        followers: PropTypes.number.isRequired,
        following: PropTypes.number.isRequired,
      }),

      otherUsers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        login: PropTypes.string.isRequired,
      })),
    }),
  }).isRequired,
};

export default isomorphic({
  isomorphicId: 'userDetail',

  getContext: async ({ fetch, setTitle, setStatus }, { match }) => {
    const [
      userResponse,
      otherUsersResponse,
    ] = await Promise.all([
      await fetch(`/api/users/${match.params.userId}`),
      await fetch(`/api/search/users?q=e`),
    ]);

    const { status } = userResponse;
    const json = await userResponse.json();

    const otherUsersJson = await otherUsersResponse.json();

    const otherUsers = otherUsersResponse.status < 400
      ? otherUsersJson.items.slice(0, 5)
      : [];

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

    return {
      user: json,
      otherUsers,
    };
  },

  shouldReload: (newProps, oldProps) =>
    newProps.match.params.userId !== oldProps.match.params.userId,
})(UserPage);
