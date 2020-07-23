import React from 'react';
import type {
  FC,
} from 'react';
import { Link } from 'react-router-dom';
import type {
  RouteComponentProps,
} from 'react-router-dom';

import { Container } from 'react-bootstrap';

import {
  isomorphic,
  LoadContextError,
} from 'react-redux-isomorphic';
import type {
  SingleState,
} from 'react-redux-isomorphic';

import type {
  LoadParams,
  User,
} from '../types';

type IsomorphicContext = {
  user: User;
  otherUsers: User[];
};

type UserPageProps = {
  isomorphic: SingleState<IsomorphicContext>;
};

const UserPage: FC<UserPageProps> = ({
  isomorphic: {
    isReady,
    context,
    error,
  },
}) => {
  if (error) {
    return (
      <Container>
        <h1>User not found</h1>

        <p>
          <Link to='/'>Back to users page</Link>
        </p>
      </Container>
    );
  }

  if (!isReady) {
    return (
      <Container>
        <h2>Loading...</h2>

        <p>
          <Link to='/'>Back to users page</Link>
        </p>
      </Container>
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
                    <Link to={`/${id}/`}>
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

export default isomorphic<RouteComponentProps<{
  userId: string;
}>, LoadParams, IsomorphicContext>({
  isomorphicId: 'userDetail',

  getContext: async ({ fetch, setTitle, setStatus }, { match }) => {
    const [
      userResponse,
      otherUsersResponse,
    ] = await Promise.all([
      await fetch(`/api/users/${match.params.userId}/`),
      await fetch('/api/users/'),
    ]);

    const { status } = userResponse;
    const json = await userResponse.json();

    const otherUsersJson = await otherUsersResponse.json();

    const otherUsers = otherUsersResponse.status < 400
      ? otherUsersJson.slice(0, 5)
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
