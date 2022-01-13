import type {
  ReactElement,
} from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { Container } from 'react-bootstrap';

import {
  isomorphic,
  LoadContextError,
} from 'react-redux-isomorphic';
import type {
  SingleState,
} from 'react-redux-isomorphic';

import type {
  User,
} from '../types';

type IsomorphicContext = {
  user: User;
  otherUsers: User[];
};

type UserPageProps = {
  isomorphic: SingleState<IsomorphicContext>;
};

function UserPage({
  isomorphic: {
    isReady,
    context,
    error,
  },
}: UserPageProps): ReactElement {
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
}

const WithIsomorphic = isomorphic<{
  userId: string;
}, IsomorphicContext>({
  isomorphicId: 'userDetail',

  getContext: async ({ fetch, setTitle, setStatus }, { userId }) => {
    const [
      userResponse,
      otherUsersResponse,
    ] = await Promise.all([
      await fetch(`/api/users/${userId}/`),
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
    newProps.userId !== oldProps.userId,
})(UserPage);

function WithMatch(): ReactElement {
  const {
    userId,
  } = useParams();

  return (
    <WithIsomorphic
      userId={userId}
    />
  );
}

export default WithMatch;
